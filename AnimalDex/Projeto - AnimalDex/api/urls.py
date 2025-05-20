from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    ViewRegistro,
    ViewIdentificacaoAnimal,
    ViewListaAnimais,
    ViewPerfilUsuario,
    ViewAlmanaqueUsuario,
)

urlpatterns = [
    path('registro/', ViewRegistro.as_view(), name='registro'),
    path('login/', obtain_auth_token, name='login'),
    path('identificar/', ViewIdentificacaoAnimal.as_view(), name='identificar'),

    path('animais/', ViewListaAnimais.as_view(), name='animais-lista'),
    path('perfil/', ViewPerfilUsuario.as_view(), name='usuario-perfil'),

    
    path('perfil/identificacoes/', ViewAlmanaqueUsuario.as_view(), name='usuario-identificacoes'),
]
