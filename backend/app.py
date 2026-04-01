from flask import Flask
from flask_cors import CORS
from routes.agent import agent_bp

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(agent_bp)

if __name__ == "__main__":
    app.run(debug=True)