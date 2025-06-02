from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.generics import UpdateAPIView, DestroyAPIView

from .models import Animais, Identificacao, PerfilUsuario
from .serializers import (
    UserSerializer,
    AnimalSerializer,
    IdentificacaoSerializer,
    PerfilUsuarioSerializer,
)

from .ia_classificacao import identify_animal
from PIL import Image

# -------------------------------------------------------------------------------------------------------------- #
# View para registro de usuário
from rest_framework.authtoken.models import Token

class ViewRegistro(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Qualquer um pode acessar (sem login)

    def create(self, request, *args, **kwargs):
        # Salva o usuário e gera o token
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()  # Cria User, PerfilUsuario e Token automaticamente

        token = Token.objects.get(user=usuario)  # Recupera o token gerado

        return Response({
            'usuario': {
                'username': usuario.username,
                'email': usuario.email,
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
            },
            'token': token.key
        }, status=status.HTTP_201_CREATED)

# -------------------------------------------------------------------------------------------------------------- #
# View para identificar animal com IA e registrar identificação + XP
class ViewIdentificacaoAnimal(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Requer autenticação

    def post(self, request):
        # Verifica se uma imagem foi enviada
        if 'foto' not in request.FILES:
            return Response({'error': 'Foto não enviada. Por favor, envie uma imagem.'}, status=status.HTTP_400_BAD_REQUEST)

        foto = request.FILES['foto']

        # Verifica se o arquivo é realmente uma imagem válida
        try:
            Image.open(foto).verify()
        except Exception:
            return Response({'error': 'Arquivo enviado não é uma imagem válida.'}, status=status.HTTP_400_BAD_REQUEST)

        # Usa a IA para tentar identificar o animal na imagem
        nome_animal = identify_animal(foto)
        if not nome_animal:
            return Response({'error': 'Não foi possível identificar o animal.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se o animal identificado existe no banco
        animal = Animais.objects.filter(nome_cientifico=nome_animal).first()
        if not animal:
            return Response({'error': f'O animal identificado ({nome_animal}) não está registrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Cria o registro da identificação
        identificacao = Identificacao.objects.create(
            usuario=request.user,
            animal=animal,
            imagem=foto
        )

        # Calcula XP com base no nível de extinção
        perfil = request.user.perfil
        xp_ganho = animal.nivel_extincao * 20  # Fórmula do XP
        perfil.adicionar_xp(xp_ganho)

        # Retorna as informações do animal e do XP ganho
        return Response({
            'nome_cientifico': animal.nome_cientifico,
            'nome_comum': animal.nome_comum,
            'nivel_perigo': animal.nivel_perigo,
            'nivel_extincao': animal.nivel_extincao,
            'descricao': animal.descricao,
            'foto_url': request.build_absolute_uri(identificacao.imagem.url),
            'xp_ganho': xp_ganho,
            'xp_total': perfil.xp,
            'nivel_atual': perfil.nivel,
        }, status=status.HTTP_200_OK)

# -------------------------------------------------------------------------------------------------------------- #
# Lista de animais com paginação
class AnimalPagination(PageNumberPagination):
    page_size = 10  # Quantidade de animais por página
    page_size_query_param = 'tamanho_pagina'
    max_page_size = 100

# View para listar todos os animais
class ViewListaAnimais(generics.ListAPIView):
    queryset = Animais.objects.all()
    serializer_class = AnimalSerializer
    pagination_class = None  # Desativada a paginação (se quiser, remover essa linha)

# View para atualizar dados de um animal (requer estar autenticado)
class ViewAtualizarAnimal(UpdateAPIView):
    queryset = Animais.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated]  # Apenas usuários autenticados

# -------------------------------------------------------------------------------------------------------------- #
# View para listar as identificações feitas pelo usuário (Almanaque)
class ViewAlmanaqueUsuario(generics.ListAPIView):
    serializer_class = IdentificacaoSerializer
    permission_classes = [permissions.IsAuthenticated]  # Requer login

    def get_queryset(self):
        # Filtra as identificações do usuário logado, da mais recente para a mais antiga
        return Identificacao.objects.filter(usuario=self.request.user).order_by('-data_identificacao')

# -------------------------------------------------------------------------------------------------------------- #
# View que mostra o perfil do usuário (XP, nível, etc.)
class ViewPerfilUsuario(generics.RetrieveAPIView):
    serializer_class = PerfilUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]  # Requer login

    def get_object(self):
        return self.request.user.perfil  # Retorna o perfil do usuário logado

# -------------------------------------------------------------------------------------------------------------- #
# Leadboard (Ranking dos usuários)
class LeadboardView(APIView):
    def get(self, request):
        User = get_user_model()  # Pega o modelo de usuário
        users = User.objects.all()
        data = []

        for user in users:
            # Filtra todas as identificações feitas pelo usuário
            capturas = Identificacao.objects.filter(usuario=user)
            # Conta quantos animais diferentes ele já identificou
            animais_ids = capturas.values_list('animal', flat=True).distinct()
            animais_descobertos = animais_ids.count()
            # Pega o nível do usuário (se não tiver, assume 1)
            nivel = getattr(user.perfil, 'nivel', 1)

            animal_mais_raro = None
            if animais_ids:
                # Busca o animal mais raro (maior nível de extinção)
                animais = Animais.objects.filter(id__in=animais_ids)
                mais_raro = animais.order_by('-nivel_extincao').first()
                if mais_raro:
                    animal_mais_raro = {
                        "nome_comum": mais_raro.nome_comum,
                        "nivel_extincao": mais_raro.nivel_extincao
                    }

            # Monta os dados do usuário para o ranking
            data.append({
                "username": user.username,
                "nivel": nivel,
                "animais_descobertos": animais_descobertos,
                "animal_mais_raro": animal_mais_raro
            })

        # Ordena o ranking: primeiro por mais animais descobertos
