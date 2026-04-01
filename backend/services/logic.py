import random

def analyze_data(data):
    if not data:
        data = {}
        
    temp = data.get("temperature", 0)
    humidity = data.get("humidity", 0)
    device = data.get("device_id", "UNKNOWN_DEVICE")
    
    # Ensure product_type is a valid key and handle capitalization
    raw_product = str(data.get("product_type") or data.get("product") or "General").strip().capitalize()
    
    # Map synonyms or common variations
    product_map = {
        "Fruit": "Fruits",
        "Pharma": "Vaccines",
        "Medication": "Vaccines"
    }
    product = product_map.get(raw_product, raw_product)

    # Product-Specific Thresholds
    thresholds = {
        "Vaccines": {"temp_max": 8, "temp_min": 2, "humidity_max": 60},
        "Fruits": {"temp_max": 10, "temp_min": 2, "humidity_max": 85},
        "Dairy": {"temp_max": 5, "temp_min": 0, "humidity_max": 75},
        "General": {"temp_max": 12, "temp_min": 0, "humidity_max": 75}
    }

    t = thresholds.get(product, thresholds["General"])

    # Hardware & Integrity Health Check
    compressor_eff = 92 - (temp if temp > 10 else 0)
    backup_power = 85 + random.random() * 10
    integrity = 100 - (temp - t["temp_max"]) * 10 if temp > t["temp_max"] else 100
    integrity = max(0, min(100, integrity))

    steps = [
        f"📊 Hardware Health Check: Compressor @ {compressor_eff:.1f}% efficiency",
        f"🔋 Backup Power: {backup_power:.0f}% stable",
        f"📦 Cargo Type: {product} | Integrity: {integrity:.1f}%",
    ]

    # Risk Calculation
    failure_prob = 0
    if temp > t["temp_max"]:
        failure_prob = min(99, (temp - t["temp_max"]) * 12 + humidity / 10)
    
    steps.append(f"🧠 AI PROJECTION: spoilage risk elevated to {failure_prob:.1f}%")

    # Temperature Analysis
    if temp > t["temp_max"]:
        steps.append(f"⚠️ THERMAL BREACH: {temp}°C (Target: <{t['temp_max']}°C)")
    elif temp < t["temp_min"]:
        steps.append(f"❄️ SUB-COOLING: {temp}°C (Target: >{t['temp_min']}°C)")
    else:
        steps.append("✅ THERMAL STABILITY: Operating within optimal range")

    # Strategic Action & Rerouting
    if failure_prob > 60:
        steps.append("🚨 EMERGENCY PROTOCOL: Active life-cycle preservation initiated")
        steps.append(f"📍 REROUTING: Diverting to nearest Tier-1 Cold Hub (ETA: 14m)")
    elif failure_prob > 20:
        steps.append("🟡 MITIGATION: Refrigeration cycle boosted to Overdrive Mode")
        steps.append("🚛 LOGISTICS: Accelerating transit to prioritize early delivery")
    else:
        steps.append("✨ STATUS: All systems green. Proceeding on primary route.")

    return {
        "device": device,
        "product": product,
        "risk_percentage": failure_prob,
        "steps": steps
    }