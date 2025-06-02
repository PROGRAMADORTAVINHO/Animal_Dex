# Importando bibliotecas necessárias
import os
import django
import requests
from bs4 import BeautifulSoup

# ------------------------------- #
# Configuração do Django
# ------------------------------- #

# Define qual é o arquivo de configuração do Django (settings)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# Inicializa o Django para que possamos usar os modelos diretamente aqui
django.setup()

# Importa o modelo de Animais da aplicação 'api'
from api.models import Animais


# ------------------------------- #
# Web Scraping - Captura de dados
# ------------------------------- #

# URL do site que contém os dados dos animais
URL = 'https://www.todamateria.com.br/animais-em-extincao/'

# Faz a requisição HTTP para acessar a página
response = requests.get(URL)

# Verifica se a requisição foi bem-sucedida (código 200)
if response.status_code == 200:
    # Faz o parsing do conteúdo HTML da página
    soup = BeautifulSoup(response.content, 'html.parser')

    # Busca todos os elementos <h3>, que no caso desse site contém os nomes dos animais
    lista_animais = soup.find_all('h3')

    # Loop que percorre cada item encontrado na lista
    for item in lista_animais:
        # Extrai o texto (nome do animal) e remove espaços extras
        nome = item.get_text(strip=True)

        # Se encontrou algum nome válido
        if nome:
            # Cria ou atualiza um registro no banco de dados
            animal, created = Animais.objects.get_or_create(
                nome_cientifico=nome,    # Usa o nome como chave
                defaults={                # Valores padrão caso seja um novo animal
                    'nome_comum': nome,
                    'nivel_perigo': 2,    # Pode ser ajustado manualmente depois
                    'nivel_extincao': 3,  # Pode ser ajustado manualmente depois
                    'descricao': 'Informação coletada automaticamente.',
                }
            )

            # Verifica se o animal foi criado agora ou já existia
            if created:
                print(f'Animal {nome} cadastrado.')
            else:
                print(f'Animal {nome} já existe no banco.')

# Caso não consiga acessar a página
else:
    print('Erro ao acessar a página.')
