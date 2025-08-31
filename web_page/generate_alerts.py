import mysql.connector
import json

# --- MySQL connection settings ---
config = {
    'user': 'sql12796661',
    'password': 'Hf5vBXfx1J',
    'host': 'sql12.freesqldatabase.com',
    'port': 3306,
    'database': 'sql12796661'
}

def generate_alerts():
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor(dictionary=True)

    # Join ml_data with locations to get location name
    cursor.execute("""
        SELECT m.location_id, l.location,
               m.dumping_quantity, m.saffir_simpson_category,
               m.sea_level_rise, m.bloom_risk_score
        FROM ml_data m
        JOIN locations l ON m.location_id = l.location_id
    """)

    rows = cursor.fetchall()
    output = []

    for row in rows:
        alerts = []

        dumping = row["dumping_quantity"]
        cyclone = row["saffir_simpson_category"]
        sea_level = row["sea_level_rise"]
        bloom = row["bloom_risk_score"]

        # --- Apply criteria (same as your Java code) ---
        # Illegal dumping
        if dumping > 50 and dumping < 200:
            alerts.append("Sea level rise exceeds safe threshold. Blue carbon ecosystems under stress, long-term coastal planning required.")
        elif dumping > 200:
            alerts.append("Rapid sea level rise detected. Risk of mangrove drowning and soil carbon loss. Authorities must initiate coastal defense and monitoring.")

        # Algal bloom
        if bloom < 20:
            alerts.append("Algal levels too low. Risk of reduced food availability for fish larvae. Authorities should monitor ecosystem balance.")
        elif bloom > 50 and bloom < 75:
            alerts.append("High algal bloom risk detected. Fishermen advised to avoid fishing in affected areas due to oxygen depletion risk.")
        elif bloom > 75:
            alerts.append("Severe algal bloom risk detected. Immediate stop on fishing recommended. Authorities should monitor water quality and issue safety warnings.")

        # Cyclone
        if cyclone >= 1 and cyclone <= 2:
            alerts.append("Cyclone detected (Category 1–2). Coastal erosion and wave surges may weaken blue carbon ecosystems. Prepare precautionary measures.")
        elif cyclone >= 3:
            alerts.append("Severe Cyclone (Category 3–5) expected. High risk to mangroves, seagrass, and coastal wetlands. Immediate evacuation and disaster response required.")

        # Sea level rise
        if sea_level > 5 and sea_level < 20:
            alerts.append("Sea level rise exceeds safe threshold. Blue carbon ecosystems under stress, long-term coastal planning required.")
        elif sea_level > 20:
            alerts.append("Rapid sea level rise detected. Risk of mangrove drowning and soil carbon loss. Authorities must initiate coastal defense and monitoring.")

        # Build JSON entry
        output.append({
            "location_id": row["location_id"],
            "location": row["location"],
            "alerts": alerts
        })

    # --- Write to JSON file ---
    with open("ml_data.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4, ensure_ascii=False)

    print("✅ Alerts exported to ml_data.json")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    generate_alerts()
