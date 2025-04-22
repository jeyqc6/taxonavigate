import json
import os
from typing import List, Dict
from openai import OpenAI
# ====== 模块说明 ======
# 这个模块包含两部分：
# 1. 与用户进行对话并收集偏好（chat_with_user）
# 2. 综合图片风格 + 对话摘要，输出两份报告（generate_user_reports）

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
# ====== 1. 与用户多轮对话收集偏好（预设关键问题 + 自动追问） ======
def chat_with_user() -> List[Dict]:
    print("\n🤖 GPT Interior Assistant: Let's talk about your dream home! Type 'done' anytime to end.\n")
    chat_history = [
        {"role": "system", "content": "You're a friendly design assistant helping users describe their ideal home."}
    ]

    questions = [
        "If anything were possible, what would your dream home look like?",
        "What's your favorite moment at home?",
        "How would you describe the soul of your home?",
        "What do you hope your friends feel when they visit your home?",
        "How would you feel if someone said your home is too trendy?"
    ]

    for q in questions:
        print(f"GPT: {q}")
        chat_history.append({"role": "assistant", "content": q})
        user_input = input("You: ")
        if user_input.lower() in ["done", "exit"]:
            break
        chat_history.append({"role": "user", "content": user_input})

        # 自动追问一条
        follow_up_prompt = [
            {"role": "system", "content": "You're a curious and emotionally intelligent interior stylist."},
            {"role": "user", "content": f"User just said: {user_input}\nGive me one thoughtful, short follow-up question."}
        ]

        try:
            follow_up_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=follow_up_prompt
            )
            follow_up = follow_up_response.choices[0].message.content.strip()
            print(f"GPT follow-up: {follow_up}")
            chat_history.append({"role": "assistant", "content": follow_up})
            user_reply = input("You: ")
            if user_reply.lower() in ["done", "exit"]:
                break
            chat_history.append({"role": "user", "content": user_reply})
        except Exception as e:
            print("⚠️ Could not generate follow-up question:", e)

    return chat_history

# ====== 2. 生成两个报告（内部 + 用户可见） ======
def generate_user_reports(image_tags: Dict, chat_history: List[Dict]) -> Dict:
    chat_summary = "\n".join([m['content'] for m in chat_history if m['role'] == 'user'])

    system_prompt = {
        "role": "system",
        "content": (
            "You are a design profiler with four jobs:\n"
            "1. Generate an internal persona report for marketers.\n"
            "   This includes:\n"
            "   - aesthetic_style\n"
            "   - emotional_tone (e.g. nostalgic: %, anti_trend: %, etc.)\n"
            "   - behavioral_habit\n"
            "   - target_ad_copy (trend_orientation, ad_resistance, tone)\n"
            "   - packaged_for (brand types or platforms)\n"
            "2. Generate a poetic, warm, and stylized persona copy for the user.\n"
            "3. Output a structured interpretation of image-derived style tags as a readable description.\n"
            "   Use natural language to explain:\n"
            "   - Aesthetic Style (e.g. 'A blend of IKEA-style and functional family comfort')\n"
            "   - Material & Texture (e.g. 'Soft fabrics, playful textiles, plastic and paper decor')\n"
            "   - Lighting & Mood (e.g. 'Soft indoor lighting creating a lively and welcoming feel')\n"
            "   - Room Typology (e.g. 'Child-friendly family room')\n"
            "   - Emotional Imagery (e.g. 'Captures a sense of creativity and playful intimacy')\n"
            "   - Persona cues (e.g. 'Someone who values order while embracing chaos in a loving way')\n"
            "4. Add a short identity label describing the user's home archetype, such as 'gentle minimalist', 'romantic rebel', 'structured visionary'.\n\n"
            "Return JSON in the following format:\n"
            "{\n"
            "  'internal_report': {...},\n"
            "  'persona_copy': '...',\n"
            "  'style_tags': {\n"
            "     'aesthetic_style': '...',\n"
            "     'material_texture': '...',\n"
            "     'lighting_mood': '...',\n"
            "     'room_typology': '...',\n"
            "     'emotional_imagery': '...',\n"
            "     'persona_cues': '...'\n"
            "  },\n"
            "  'home_archetype': 'gentle minimalist'\n"
            "}"
        )
    }


    user_prompt = {
        "role": "user",
        "content": f"Image-derived tags:\n{json.dumps(image_tags, indent=2)}\n\nUser conversation summary:\n{chat_summary}"
    }

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[system_prompt, user_prompt]
    )

    reply = response.choices[0].message.content
    try:
        report = json.loads(reply.replace("'", '"'))
    except json.JSONDecodeError:
        print("❌ GPT reply is not valid JSON. Here is the raw output:")
        print(reply)
        raise

    return report

# ====== 示例测试用法 ======
if __name__ == "__main__":
    mock_image_tags = {
        "aesthetic_style": "Japandi",
        "material_texture": "natural wood",
        "lighting_mood": "soft daylight",
        "room_typology": "studio",
        "emotional_imagery": "calm, nostalgic",
        "persona_cues": "introspective"
    }

    chat_history = chat_with_user()
    result = generate_user_reports(mock_image_tags, chat_history)

    # Step 3: 保存为 JSON 文件
    with open("user_persona_report.json", "w") as f:
        json.dump(result, f, indent=2)
    print("✅ JSON report saved to 'user_persona_report.json'")

    print("\n📦 Internal Report:")
    print(json.dumps(result['internal_report'], indent=2))

    print("\n🎁 Persona Copy (User View):")
    print(result['persona_copy'])

    print("\n🔖 Style Tags:")
    print(json.dumps(result['style_tags'], indent=2))
