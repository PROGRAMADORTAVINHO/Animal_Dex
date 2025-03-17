from django.db import models
from django.contrib.auth.models import User

# ------------------------------ #
# Arquivo de Modelos (Tabelas)
# ------------------------------ #

# Modelo de Animais
class Animais(models.Model):
    nome = models.CharField(max_length=100)
    especie = models.CharField(max_length=100)
    nivel_perigo = models.CharField(max_length=100)
    nivel_extincao = models.CharField(max_length=100)
    descricao = models.TextField()

    def __str__(self):
        return self.nome

# ----------------------------------------------------------------------- #

# Modelo de perfil do Usuário
class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')

    def __str__(self):
        return self.user.username

# ----------------------------------------------------------------------- #    
    
# Modelo fotos dos animais lançadas pelo usuario
class FotosAnimais(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fotos_animais')
    foto = models.ImageField(upload_to='fotos-animais/')
    animal = models.ForeignKey('Animais', on_delete=models.SET_NULL, null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foto de {self.animais.nome} por {self.user.username}"