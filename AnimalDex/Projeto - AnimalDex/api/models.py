from django.db import models
from django.contrib.auth.models import User

# ------------------------------ #
# Arquivo de Modelos (Tabelas)
# ------------------------------ #

# Modelo de Animais
class Animais(models.Model):
    nome_cientifico = models.CharField(max_length=255, unique=True)
    nome_comum = models.CharField(max_length=255, blank=True, null=True)
    nivel_perigo = models.IntegerField(default=1)       # Ex: 1 - não perigoso, 5 - extremamente perigoso
    nivel_extincao = models.IntegerField(default=1)     # Ex: 1 - comum, 5 - extremamente raro
    descricao = models.TextField(blank=True, null=True)
    imagem_referencia = models.ImageField(upload_to='imagens_animais/', blank=True, null=True)

    def __str__(self):
        return self.nome_cientifico

# ----------------------------------------------------------------------- #

# Modelo de perfil do Usuário
class PerfilUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    xp = models.IntegerField(default=0)
    nivel = models.IntegerField(default=1)

    def adicionar_xp(self, quantidade):
        self.xp += quantidade
        while self.xp >= self.xp_para_proximo_nivel():
            self.nivel += 1
            self.xp -= self.xp_para_proximo_nivel()
        self.save()

    def xp_para_proximo_nivel(self):
        return 100 + (self.nivel - 1) * 50  # Exemplo: escada de XP
    
    def __str__(self):
        return f'{self.user.username} - Nível {self.nivel}'

# ----------------------------------------------------------------------- #    
    
# Modelo fotos dos animais lançadas pelo usuario
class Identificacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    animal = models.ForeignKey(Animais, on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='identificacoes/')
    data_identificacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} identificou {self.animal.nome_cientifico} em {self.data_identificacao.strftime('%d/%m/%Y %H:%M')}"