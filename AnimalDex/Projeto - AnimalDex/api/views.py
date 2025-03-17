from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response


# View para registro
from .serializers import UserSerializer

class ViewRegistro(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# -------------------------------------------------------------------------------------------------------------- #

# View para receber imagem e retornar informações - IA, PARA TERMINAR
from .models import Animais
from .ia_classificacao import identify_animal

class ViewIdentificacaoAnimal(APIView):
    def post(self, request):
        if 'foto' not in request.FILES:
            return Response({'error': 'Foto não enviada'}, status=status.HTTP_400_BAD_REQUEST)

        foto = request.FILES['foto']
        nome_animal = identify_animal(foto)  # Identifica o animal
        animal = Animais.objects.filter(name=nome_animal).first()

        FotosAnimais.objects.create(user=request.usuario, photo=foto, animal=animal)
        if animal:
            return Response({
                'nome': animal.nome,
                'especie': animal.especie,
                'nivel_perigo': animal.nivel_perigo,
                'nivel_extincao': animal.nivel_extincao,
                'descricao': animal.descricao,
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Animal não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
# -------------------------------------------------------------------------------------------------------------- #

# View para listar os animais
from .models import Animais
from .serializers import AnimalSerializer

class ViewListaAnimais(generics.ListAPIView):
    queryset = Animais.objects.all()
    serializer_class = AnimalSerializer

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
