from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
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

# View para registro
from rest_framework.authtoken.models import Token

class ViewRegistro(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Salva o usuário e gera o token
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()  # Isso já cria User + PerfilUsuario + Token

        token = Token.objects.get(user=usuario)

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
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if 'foto' not in request.FILES:
            return Response({'error': 'Foto não enviada. Por favor, envie uma imagem.'}, status=status.HTTP_400_BAD_REQUEST)

        foto = request.FILES['foto']

        try:
            Image.open(foto).verify()
        except Exception:
            return Response({'error': 'Arquivo enviado não é uma imagem válida.'}, status=status.HTTP_400_BAD_REQUEST)

        nome_animal = identify_animal(foto)
        if not nome_animal:
            return Response({'error': 'Não foi possível identificar o animal.'}, status=status.HTTP_400_BAD_REQUEST)

        animal = Animais.objects.filter(nome=nome_animal).first()
        if not animal:
            return Response({'error': f'O animal identificado ({nome_animal}) não está registrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Criar registro da identificação
        identificacao = Identificacao.objects.create(
            usuario=request.user,
            animal=animal,
            imagem=foto
        )

        # Calcular XP com base no nível de extinção
        perfil = request.user.perfil
        xp_ganho = animal.nivel_extincao * 20
        perfil.adicionar_xp(xp_ganho)

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
    page_size = 10
    page_size_query_param = 'tamanho_pagina'
    max_page_size = 100

class ViewListaAnimais(generics.ListAPIView):
    queryset = Animais.objects.all()
    serializer_class = AnimalSerializer
    pagination_class = AnimalPagination

# Atualizar animal (admin ou autenticado)
class ViewAtualizarAnimal(UpdateAPIView):
    queryset = Animais.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated]

# -------------------------------------------------------------------------------------------------------------- #

# View para ver o almanaque do usuário (suas identificações)
class ViewAlmanaqueUsuario(generics.ListAPIView):
    serializer_class = IdentificacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Identificacao.objects.filter(usuario=self.request.user).order_by('-data_identificacao')

# -------------------------------------------------------------------------------------------------------------- #

# Perfil do usuário com XP e nível
class ViewPerfilUsuario(generics.RetrieveAPIView):
    serializer_class = PerfilUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.perfil

# -------------------------------------------------------------------------------------------------------------- #
