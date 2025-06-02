from django.db import models
from django.contrib.auth.models import User

# ------------------------------ #
# Arquivo de Modelos (Tabelas)
# ------------------------------ #

# ------------------------------ #
# Modelo de Animais
# ------------------------------ #
class Animais(models.Model):
    # Nome científico do animal (único, não pode se repetir)
    nome_cientifico = models.CharField(max_length=255, unique=True)

    # Nome comum (pode ser nulo ou em branco)
    nome_comum = models.CharField(max_length=255, blank=True, null=True)

    # Nível de perigo (escala de 1 a 5, por exemplo)
    nivel_perigo = models.IntegerField(default=1)

    # Nível de extinção (escala de 1 a 5, quanto maior mais raro)
    nivel_extincao = models.IntegerField(default=1)

    # Descrição do animal
    descricao = models.TextField(blank=True, null=True)

    # Imagem de referência do animal
    imagem_referencia = models.ImageField(upload_to='imagens_animais/', blank=True, null=True)

    def __str__(self):
        # Retorna o nome científico quando o objeto é exibido no admin ou no shell
        return self.nome_cientifico


# ----------------------------------------------------------------------- #
# Modelo de Perfil do Usuário (XP e Nível)
# ----------------------------------------------------------------------- #
class PerfilUsuario(models.Model):
    # Ligação 1-para-1 com o usuário padrão do Django
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')

    # XP atual do usuário
    xp = models.IntegerField(default=0)

    # Nível atual do usuário
    nivel = models.IntegerField(default=1)

    # Função para adicionar XP e subir de nível automaticamente
    def adicionar_xp(self, quantidade):
        self.xp += quantidade
        while self.xp >= self.xp_para_proximo_nivel():
            self.nivel += 1
            self.xp -= self.xp_para_proximo_nivel()
        self.save()  # Salva as alterações no banco

    # Calcula o XP necessário para o próximo nível
    def xp_para_proximo_nivel(self):
        return 100 + (self.nivel - 1) * 50  # Fórmula simples: cada nível precisa de mais 50 de XP

    def __str__(self):
        # Exibe o nome do usuário e o nível no admin ou no shell
        return f'{self.user.username} - Nível {self.nivel}'


# ----------------------------------------------------------------------- #
# Modelo de Identificação (Fotos feitas pelos usuários)
# ----------------------------------------------------------------------- #
class Identificacao(models.Model):
    # Usuário que fez a identificação
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    # Animal identificado
    animal = models.ForeignKey(Animais, on_delete=models.CASCADE)

    # Imagem enviada pelo usuário como prova da identificação
    imagem = models.ImageField(upload_to='identificacoes/')

    # Data e hora em que a identificação foi feita (preenchido automaticamente)
    data_identificacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Texto descritivo da identificação para o admin ou shell
        return f"{self.usuario.username} identificou {self.animal.nome_cientifico} em {self.data_identificacao.strftime('%d/%m/%Y %H:%M')}"
