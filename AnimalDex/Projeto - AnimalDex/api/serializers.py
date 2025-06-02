from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Animais, PerfilUsuario, Identificacao

# ------------------------------------------------------------------------------- #
# Serializador do Usuário
class UserSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True)  # A senha será apenas para escrita, não aparece na resposta

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'senha', 'email']  # Campos que serão manipulados

    def create(self, validated_data):
        # Cria o usuário utilizando o método create_user (que já cuida da hash da senha)
        usuario = User.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            password=validated_data['senha'],  # A senha é salva de forma segura
            email=validated_data.get('email', ''),
        )

        # Cria o token de autenticação para o usuário
        Token.objects.create(user=usuario)

        return usuario

    def validate_username(self, value):
        # Valida se o username já existe no banco de dados
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")
        return value

# ------------------------------------------------------------------------------- #
# Serializador dos Animais
class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animais  # Modelo que será serializado
        fields = ['id', 'nome_cientifico', 'nome_comum', 'nivel_perigo', 'nivel_extincao', 'descricao']
        # Campos que irão para a API

# ------------------------------------------------------------------------------- #
# Serializador do Perfil do Usuário (XP, nível e informações adicionais)
class PerfilUsuarioSerializer(serializers.ModelSerializer):
    # Informações do usuário vinculadas ao perfil
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    nome = serializers.CharField(source='user.first_name', read_only=True)

    # Campos calculados dinamicamente
    xp_para_proximo_nivel = serializers.SerializerMethodField()
    animais_descobertos = serializers.SerializerMethodField()

    class Meta:
        model = PerfilUsuario  # Modelo do perfil
        fields = [
            'username', 'email', 'nome', 'xp', 'nivel',
            'xp_para_proximo_nivel', 'animais_descobertos'
        ]  # Campos que serão exibidos na API

    def get_xp_para_proximo_nivel(self, obj):
        # Chama a função que calcula quanto XP falta para o próximo nível
        return obj.xp_para_proximo_nivel()

    def get_animais_descobertos(self, obj):
        # Conta quantos animais diferentes o usuário já identificou
        return (
            Identificacao.objects
            .filter(usuario=obj.user)
            .values('animal')
            .distinct()
            .count()
        )

# ------------------------------------------------------------------------------- #
# Serializador das Identificações (Almanaque do usuário)
from rest_framework.reverse import reverse  # Importado para gerar URLs reversas se necessário

class IdentificacaoSerializer(serializers.ModelSerializer):
    # Serializa o animal completo usando o AnimalSerializer
    animal = AnimalSerializer(read_only=True)

    # Inclui o link da imagem capturada
    imagem = serializers.ImageField(use_url=True, read_only=True)

    # Formata a data para o formato dia/mês/ano e hora:minuto
    data_identificacao = serializers.DateTimeField(format="%d/%m/%Y %H:%M", read_only=True)

    # Mostra o nome de usuário que fez a identificação
    usuario = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Identificacao  # Modelo que será serializado
        fields = ['id', 'animal', 'imagem', 'data_identificacao', 'usuario']
        # Campos exibidos na resposta da API
