from django.contrib import admin
from .models import Animais, PerfilUsuario, Identificacao

# Registrar os modelos (tabelas) aqui
admin.site.register(Animais)
admin.site.register(PerfilUsuario)
admin.site.register(Identificacao)
