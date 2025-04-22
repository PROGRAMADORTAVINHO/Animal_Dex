# ------------------------------------------ #
# Arquivo com o modelo e lógica da IA - A FAZER!
# ------------------------------------------ #
import torch
from torchvision import transforms
from PIL import Image
from torchvision import models

# Carregar o modelo treinado
MODEL_PATH = "animal_classifier.pth"
model = models.resnet50(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, len(open("Dataset/name of the animals.txt").readlines()))
model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()

# Transformações para pré-processar a imagem
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# Função para identificar o animal
def identify_animal(image_file):
    try:
        # Abrir a imagem e aplicar as transformações
        image = Image.open(image_file).convert('RGB')
        image = transform(image).unsqueeze(0)  # Adicionar uma dimensão para o batch

        # Fazer a previsão
        with torch.no_grad():
            outputs = model(image)
            _, predicted = outputs.max(1)  # Pegar a classe com maior probabilidade

        # Mapear o índice para o nome da classe
        class_names = open("Dataset/name of the animals.txt").read().splitlines()
        return class_names[predicted.item()]
    except Exception as e:
        print(f"Erro ao identificar o animal: {e}")
        return None