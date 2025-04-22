from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Animais, FotosAnimais
from .serializers import UserSerializer, FotosAnimaisSerializer
from PIL import Image


# View para registro
from .serializers import UserSerializer

class ViewRegistro(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# -------------------------------------------------------------------------------------------------------------- #

# View para receber imagem e retornar informações - IA, PARA TERMINAR
from PIL import Image
from .ia_classificacao import identify_animal

class ViewIdentificacaoAnimal(APIView):
    def post(self, request):
        if 'foto' not in request.FILES:
            return Response({'error': 'Foto não enviada. Por favor, envie uma imagem.'}, status=status.HTTP_400_BAD_REQUEST)

        foto = request.FILES['foto']

        try:
            Image.open(foto).verify()
        except Exception:
            return Response({'error': 'Arquivo enviado não é uma imagem válida. Certifique-se de enviar um arquivo de imagem.'}, status=status.HTTP_400_BAD_REQUEST)

        nome_animal = identify_animal(foto)
        if not nome_animal:
            return Response({'error': 'Não foi possível identificar o animal na imagem.'}, status=status.HTTP_400_BAD_REQUEST)

        animal = Animais.objects.filter(nome=nome_animal).first()
        if not animal:
            return Response({'error': f'O animal identificado ({nome_animal}) não está registrado no banco de dados.'}, status=status.HTTP_404_NOT_FOUND)

        # Salvar a foto no banco de dados
        foto_obj = FotosAnimais.objects.create(user=request.user, photo=foto, animal=animal)

        return Response({
            'nome': animal.nome,
            'especie': animal.especie,
            'nivel_perigo': animal.nivel_perigo,
            'nivel_extincao': animal.nivel_extincao,
            'descricao': animal.descricao,
            'foto_url': request.build_absolute_uri(foto_obj.photo.url),  # URL completa da foto
        }, status=status.HTTP_200_OK)
# -------------------------------------------------------------------------------------------------------------- #

# View para listar os animais
from .models import Animais
from .serializers import AnimalSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import UpdateAPIView
from rest_framework.generics import DestroyAPIView

# Meio de paginar a lista de animais
class AnimalPagination(PageNumberPagination):
    tamanho_pagina = 10  # Número de itens por página
    page_size_query_param = 'tamanho_pagina'
    max_tam_pagina = 100

class ViewListaAnimais(generics.ListAPIView):
    queryset = Animais.objects.all()
    serializer_class = AnimalSerializer
    pagination_class = AnimalPagination

# View para atulizar um animal
class ViewAtualizarAnimal(UpdateAPIView):
    queryset = Animais.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated]

# View para deletar imagens dos animais
class ViewDeletarFotoAnimal(DestroyAPIView):
    queryset = FotosAnimais.objects.all()
    serializer_class = FotosAnimaisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Garante que o usuário só pode deletar suas próprias fotos
        return FotosAnimais.objects.filter(user=self.request.user)

# -------------------------------------------------------------------------------------------------------------- #

# View Para Perfil do Usuário
from .models import PerfilUsuario
from .serializers import PerfilUsuarioSerializer

class ViewPerfilUsuario(generics.RetrieveAPIView):
    serializer_class = PerfilUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
# -------------------------------------------------------------------------------------------------------------- #

# View para listar as fotos de animais do Usuario
from .models import FotosAnimais
from .serializers import FotosAnimaisSerializer

class ViewFotosAnimaisUsuario(generics.ListAPIView):
    serializer_class = FotosAnimaisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FotosAnimais.objects.filter(user=self.request.user)
    
# -------------------------------------------------------------------------------------------------------------- #
