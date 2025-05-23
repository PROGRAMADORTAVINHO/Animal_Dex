import os
import torch
from torch import nn, optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# Configurações
DATASET_DIR = "Dataset/animals"  # Caminho para o dataset
MODEL_SAVE_PATH = "animal_classifier.pth"  # Salva o modelo na pasta atual
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 0.001
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Transformações para pré-processar as imagens
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Redimensionar para o tamanho esperado pelo modelo
    transforms.ToTensor(),          # Converter para tensor
    transforms.Normalize(           # Normalizar com os valores da ImageNet
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# Carrega o dataset
dataset = datasets.ImageFolder(DATASET_DIR, transform=transform)
dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# Mapea os índices para nomes das classes
class_names = dataset.classes
print(f"Classes detectadas: {class_names}")

# Carrega um modelo pré-treinado (ResNet50)
model = models.resnet50(pretrained=True)

# Ajusta a última camada para o número de classes no dataset
num_classes = len(class_names)
model.fc = nn.Linear(model.fc.in_features, num_classes)

# Move o modelo para o dispositivo (GPU ou CPU)
model = model.to(DEVICE)

# Define a função de perda e o otimizador
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# Treinamento do modelo
print("Iniciando o treinamento...")
for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    for inputs, labels in dataloader:
        inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)

        # Zera os gradientes
        optimizer.zero_grad()

        # Forward
        outputs = model(inputs)
        loss = criterion(outputs, labels)

        # Backward
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    print(f"Época {epoch + 1}/{EPOCHS}, Loss: {running_loss / len(dataloader):.4f}")

# Salva o modelo treinado
torch.save(model.state_dict(), MODEL_SAVE_PATH)
print(f"Modelo salvo em {MODEL_SAVE_PATH}")