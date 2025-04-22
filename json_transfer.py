import json

def unify_format(data):
    unified_data = []
    for item in data:
        # 标准化键名
        new_item = {
            "filename": item.get("Filename", item.get("filename")),
            "description": item.get("Description", item.get("description")),
            "aesthetic_style": ", ".join(item.get("Aesthetic Style", [])) if "Aesthetic Style" in item else item.get("aesthetic_style", ""),
            "material_texture": ", ".join(item.get("Material & Texture", [])) if "Material & Texture" in item else item.get("material_texture", ""),
            "lighting_mood": ", ".join(item.get("Lighting & Mood", [])) if "Lighting & Mood" in item else item.get("lighting_mood", ""),
            "room_typology": ", ".join(item.get("Room Typology", [])) if "Room Typology" in item else item.get("room_typology", ""),
            "emotional_imagery": ", ".join(item.get("Emotional Imagery", [])) if "Emotional Imagery" in item else item.get("emotional_imagery", ""),
            "persona_cues": ", ".join(item.get("Persona cues", [])) if "Persona cues" in item else item.get("persona_cues", "")
        }
        unified_data.append(new_item)
    return unified_data

# 读取 JSON 文件
with open("image_des.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# 转换数据
unified_data = unify_format(data)

# 保存为新 JSON 文件
with open("image_descriptions.json", "w", encoding="utf-8") as file:
    json.dump(unified_data, file, indent=2, ensure_ascii=False)