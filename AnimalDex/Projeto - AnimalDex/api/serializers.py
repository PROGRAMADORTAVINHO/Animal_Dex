from rest_framework import serializers
from django.contrib.auth.models import User


# Serializador do Usuário
class UserSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'username', 'senha', 'email']

    def create(self, validated_data):
        usuario = User.objects.create_user(
            first_name=validated_data['first_name'],  # Nome completo
            username=validated_data['username'],      # Nome de usuário
            password=validated_data['senha'],         # Senha
            email=validated_data.get('email', ''),    # Email
        )
        return usuario

# ------------------------------------------------------------------------------- #

# Serializador dos Animais
from .models import Animais

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animais
        fields = ['nome', 'especie', 'nivel_perigo', 'nivel_extincao', 'descricao']

# ------------------------------------------------------------------------------- #

# Serializador para o Perfil de Usuário
from .models import PerfilUsuario, FotosAnimais
from django.contrib.auth.models import User

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name']  # Adicione outros campos personalizados aqui

class FotosAnimaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = FotosAnimais
        fields = ['id', 'foto', 'animal', 'criado_em']