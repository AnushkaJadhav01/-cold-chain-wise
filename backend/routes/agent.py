from flask import Blueprint, request, jsonify
from services.logic import analyze_data

agent_bp = Blueprint("agent", __name__)

@agent_bp.route("/run-agent", methods=["POST"])
def run_agent():
    data = request.json

    result = analyze_data(data)

    return jsonify(result)