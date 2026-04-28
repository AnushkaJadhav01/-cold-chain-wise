import os
import google.generativeai as genai

# Try to configure the Gemini client
api_key = os.getenv("GOOGLE_API_KEY")
model = None

if api_key:
    genai.configure(api_key=api_key)
    # Using the fast & cost-effective 1.5 Flash model
    model = genai.GenerativeModel("gemini-1.5-flash")

def generate_explanation(delay: float, temp: float, distance: float, risk: int) -> str:
    """
    Calls the Google Gemini API to generate an AI explanation for the current Cold Chain risk scenario.
    """
    if not model:
        return "🧠 Gemini API key not configured. Please set the GOOGLE_API_KEY environment variable to enable AI explanations."
        
    prompt = (
        f"You are a supply-chain AI assistant for the 'Cold-Chain-Wise' platform. "
        f"Given the following simulated scenario:\n"
        f"- Transit Delay: {delay} hours\n"
        f"- Temperature exposure: {temp} °C\n"
        f"- Distance: {distance} km\n"
        f"- Computed Risk Score: {risk}%\n\n"
        f"Explain why this risk level is what it is, in a concise, professional, and actionable tone "
        f"that would be useful to a logistics operator. Keep your answer under 50 words."
    )
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"⚠️ Unable to generate AI explanation at this time (Error: {str(e)[:50]})."
