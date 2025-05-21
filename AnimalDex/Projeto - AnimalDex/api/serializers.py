from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Animais, PerfilUsuario, Identificacao

# ------------------------------------------------------------------------------- #
# Serializador do Usuário
class UserSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'senha', 'email']

    def create(self, validated_data):
        # Cria o usuário
        usuario = User.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            password=validated_data['senha'],
            email=validated_data.get('email', ''),
        )

        # Cria o perfil do usuário (xp e nível)
        #PerfilUsuario.objects.create(user=usuario)

        # Gera token de autenticação
        Token.objects.create(user=usuario)

        return usuario
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")
        return value


# ------------------------------------------------------------------------------- #
# Serializador dos Animais
class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animais
        fields = ['id', 'nome_cientifico', 'nome_comum', 'nivel_perigo', 'nivel_extincao', 'descricao']

# ------------------------------------------------------------------------------- #
# Serializador do Perfil do Usuário (XP e Nível)
class PerfilUsuarioSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    nome = serializers.CharField(source='user.first_name', read_only=True)
    xp_para_proximo_nivel = serializers.SerializerMethodField()
    animais_descobertos = serializers.SerializerMethodField()

    class Meta:
        model = PerfilUsuario
        fields = [
            'username', 'email', 'nome', 'xp', 'nivel', 'xp_para_proximo_nivel',  # seus campos atuais
            'animais_descobertos',
        ]

    def get_xp_para_proximo_nivel(self, obj):
        return obj.xp_para_proximo_nivel()

    def get_animais_descobertos(self, obj):
        # Conta quantos animais únicos o usuário identificou
        return (
            Identificacao.objects
            .filter(usuario=obj.user)
            .values('animal')
            .distinct()
            .count()
        )

# ------------------------------------------------------------------------------- #
# Serializador das Identificações (Almanaque do usuário)
from rest_framework.reverse import reverse

class IdentificacaoSerializer(serializers.ModelSerializer):
    animal = AnimalSerializer(read_only=True)
    imagem = serializers.ImageField(use_url=True, read_only=True)
    data_identificacao = serializers.DateTimeField(format="%d/%m/%Y %H:%M", read_only=True)
    usuario = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Identificacao
        fields = ['id', 'animal', 'imagem', 'data_identificacao', 'usuario']
