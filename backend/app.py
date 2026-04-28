import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.agent import agent_bp
from gemini_service import generate_explanation
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(agent_bp)

@app.route('/gemini-explain', methods=['POST'])
def gemini_explain():
    data = request.json or {}
    delay = data.get('delay', 0)
    temp = data.get('temperature', 0)
    distance = data.get('distance', 50)
    risk = data.get('risk', 0)
    
    explanation = generate_explanation(delay, temp, distance, risk)
    return jsonify({"explanation": explanation})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "GAT-RL Backend"})

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Cold-Chain-Wise Backend is running!",
        "status": "online",
        "endpoints": ["/gemini-explain", "/health"]
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)