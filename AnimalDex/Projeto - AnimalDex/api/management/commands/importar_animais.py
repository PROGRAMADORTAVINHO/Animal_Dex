import os
from django.core.management.base import BaseCommand
from api.models import Animais

DATASET_PATH = 'Dataset/animals/'

class Command(BaseCommand):
    help = 'Importa os animais da pasta Dataset/animals para o banco de dados'

    def handle(self, *args, **options):
        if not os.path.exists(DATASET_PATH):
            self.stdout.write(self.style.ERROR('Pasta Dataset/animals não encontrada.'))
            return

        for folder_name in os.listdir(DATASET_PATH):
            full_path = os.path.join(DATASET_PATH, folder_name)

            if os.path.isdir(full_path):
                nome_cientifico = folder_name.replace('_', ' ')
                
                # Verifica se já existe
                if Animais.objects.filter(nome_cientifico=nome_cientifico).exists():
                    self.stdout.write(f'{nome_cientifico} já está registrado.')
                    continue

                animal = Animais.objects.create(
                    nome_cientifico=nome_cientifico,
                    nome_comum='',
                    nivel_perigo=1,
                    nivel_extincao=1,
                    descricao='Descrição pendente.'
                )
                self.stdout.write(self.style.SUCCESS(f'Registrado: {animal.nome_cientifico}'))
