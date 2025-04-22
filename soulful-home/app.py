from flask import Flask, request, jsonify
from persona_generator import chat_with_user, generate_user_reports

app = Flask(__name__)

# 示例标签（实际项目中你可以从图像选择或数据库读取）
mock_image_tags = {
    "aesthetic_style": "Japandi",
    "material_texture": "natural wood",
    "lighting_mood": "soft daylight",
    "room_typology": "studio",
    "emotional_imagery": "calm, nostalgic",
    "persona_cues": "introspective"
}

@app.route('/api/generate_report', methods=['POST'])
def generate_report():
    try:
        # 允许前端发送对话内容；如果为空就用 chat_with_user()
        if request.is_json:
            data = request.get_json()
            chat_history = data.get("chat_history", None)
        else:
            return jsonify({"error": "Invalid or missing JSON body"}), 400

        if not chat_history:
            chat_history = chat_with_user()

        report = generate_user_reports(mock_image_tags, chat_history)
        return jsonify(report)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
