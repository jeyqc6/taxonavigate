import json
import torch
import numpy as np
from transformers import CLIPProcessor, CLIPModel
from typing import List, Dict

# initialize the CLIP model and processor
device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# load the image descriptions
with open("image_descriptions.json", "r") as f:
    image_data = json.load(f)

# combine fields into a single text string
def combine_fields(entry: Dict) -> str:
    return (
        f"{entry.get('description', '')}. "
        f"Style: {entry.get('aesthetic_style', '')}. "
        f"Material: {entry.get('material_texture', '')}. "
        f"Lighting: {entry.get('lighting_mood', '')}. "
        f"Room type: {entry.get('room_typology', '')}. "
        f"Emotion: {entry.get('emotional_imagery', '')}. "
        f"Persona: {entry.get('persona_cues', '')}."
    )

texts = [combine_fields(entry) for entry in image_data]

# calculate text embeddings
def compute_text_embeddings(texts: List[str]) -> np.ndarray:
    inputs = processor(text=texts, return_tensors="pt", padding=True, truncation=True).to(device)
    with torch.no_grad():
        features = model.get_text_features(**inputs)
    features = features / features.norm(p=2, dim=-1, keepdim=True)
    return features.cpu().numpy()

embeddings = compute_text_embeddings(texts)

# write the embeddings to a JSON file
output = []
for i, entry in enumerate(image_data):
    output.append({
        "filename": entry["filename"],
        "embedding_input": texts[i], 
        "embedding": embeddings[i].tolist()
    })

with open("image_text_embeddings.json", "w") as f:
    json.dump(output, f)

print("✅ Embeddings saved to image_text_embeddings.json")
