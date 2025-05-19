# semantic_search.py

import json
import torch
import numpy as np
from transformers import CLIPProcessor, CLIPModel
from typing import List, Tuple
from scipy.spatial.distance import cosine
import sys
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(SCRIPT_DIR, "..", "public")

# initialize the CLIP model and processor
device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# load the image descriptions and embeddings
with open(os.path.join(PUBLIC_DIR, "image_text_embeddings.json"), "r") as f:
    image_data = json.load(f)

# combine fields into a single text string
image_embeddings = np.array([entry["embedding"] for entry in image_data])
filenames = [entry["filename"] for entry in image_data]

# function to compute text embeddings
def compute_text_embedding(query: str) -> np.ndarray:
    if not isinstance(query, str):
        query = str(query)
    inputs = processor(text=query, return_tensors="pt", padding=True, truncation=True).to(device)
    with torch.no_grad():
        features = model.get_text_features(**inputs)
    features = features / features.norm(p=2, dim=-1, keepdim=True)
    return features.cpu().numpy()[0]

def main():
    if len(sys.argv) != 2:
        print("Usage: python semantic_search.py <user_report_file>")
        sys.exit(1)
    
    # Read the user report from file
    with open(sys.argv[1], 'r') as f:
        user_report = json.load(f)
    
    # Extract user preferences
    user_preferences = []
    if "internal_report" in user_report:
        user_preferences.extend([
            str(user_report["internal_report"]["aesthetic_style"]),
            str(user_report["internal_report"]["emotional_tone"]),
            str(user_report["internal_report"]["behavioral_habit"])
        ])
    if "style_tags" in user_report:
        user_preferences.extend([
            str(user_report["style_tags"]["aesthetic_style"]),
            str(user_report["style_tags"]["material_texture"]),
            str(user_report["style_tags"]["lighting_mood"]),
            str(user_report["style_tags"]["room_typology"]),
            str(user_report["style_tags"]["emotional_imagery"]),
            str(user_report["style_tags"]["persona_cues"])
        ])
    if "home_archetype" in user_report:
        user_preferences.append(str(user_report["home_archetype"]))
    
    # Calculate average embedding for user preferences
    user_embedding = np.mean([compute_text_embedding(pref) for pref in user_preferences], axis=0)
    
    # Calculate similarities with all images
    similarities = []
    for i, image_embedding in enumerate(image_embeddings):
        similarity = cosine(user_embedding, image_embedding)
        similarities.append((filenames[i], similarity))
    
    # Sort by similarity
    similarities.sort(key=lambda x: x[1], reverse=True)
    
    # Get top 6 matches
    top_matches = similarities[:6]
    bottom_matches = similarities[-6:]
    
    # Read image descriptions
    with open(os.path.join(SCRIPT_DIR, "image_descriptions.json"), "r") as f:
        descriptions = json.load(f)
    
    # Convert descriptions list to dictionary for easier lookup
    description_dict = {item["filename"]: item["description"] for item in descriptions}
    
    # Prepare results
    results = {
        "inspirations": [
            {
                "image_path": f"/house-image/{match[0]}",  # Update path to point to house-image directory
                "description": description_dict.get(match[0], "No description available"),
                "relevance_score": float(match[1]),
                "matching_aspects": user_preferences
            }
            for match in top_matches
        ],
        "least_matches": [
            {
            "image_path": f"/house-image/{match[0]}",
            "description": description_dict.get(match[0], "No description available"),
            "relevance_score": float(match[1]),
            "matching_aspects": user_preferences
        }
        for match in bottom_matches
        ]
        
    }
    
    # Output results
    print(json.dumps(results))

if __name__ == "__main__":
    main()
