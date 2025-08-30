import mysql.connector
from Models import chlorophyll_prediction, CyclonePrediction, dumpingModel, sealevel_rise_model

config = {
    'user': 'sql12796661',
    'password': 'Hf5vBXfx1J',
    'host': 'sql12.freesqldatabase.com',
    'port': 3306,
    'database': 'sql12796661'
}

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM ml_data")
    rows = cursor.fetchall()

    # Load models once outside the loop for efficiency
    modelc = chlorophyll_prediction.AlgalBloomPredictor()
    modelc.load_model(r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\Models\algal_bloom_model.pkl')
    modelslr = sealevel_rise_model.load_model(r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\Models\sea_level_rise_model.pkl')
    dumping_model = dumpingModel.load_model(r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\Models\dumping_model.pkl')
    cyclone_model1 = CyclonePrediction.CycloneCategoryPredictor()
    cyclone_model1.load_model(r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\Models\Modelscyclone_category_model.pkl')

    for row in rows:
        row = list(row)  # Convert tuple to list if you want to modify it

        risk_score = modelc.predict(row[2], row[3], row[4], row[5])
        sea_level_rise = modelslr.predict([[row[11], row[10]]])[0]
        dumping_risk = dumping_model.predict([[row[12], row[5], row[3]]])[0]
        cyclone_risk = cyclone_model1.predict(row[6], row[7], row[8], row[9])

        # Update the row in the database (replace 'id' with your primary key column)
        update_query = """
            UPDATE ml_data
            SET dumping_quantity=%s, saffir_simpson_category=%s, sea_level_rise=%s, bloom_risk_score=%s
            WHERE location_id=%s
        """
        cursor.execute(update_query, (dumping_risk, cyclone_risk, sea_level_rise, risk_score, row[0]))

    conn.commit()  # Save all changes

except mysql.connector.Error as err:
    print(f"Error: {err}")

finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()