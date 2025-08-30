import mysql.connector
import random
from datetime import datetime

# Connect to MySQL
conn = mysql.connector.connect(
    host="sql12.freesqldatabase.com",
    user="sql12796661",
    password="Hf5vBXfx1J",  # change this to your password
    database="sql12796661"
)
cursor = conn.cursor()

# Generate random sensor data for one location
def generate_random_data(location_id):
    return {
        "location_id": location_id,
        "ts": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "chlorophyll_a_ug_l": round(random.uniform(0.5, 50.0), 2),
        "do_mg_l": round(random.uniform(2.0, 14.0), 2),
        "water_temp_c": round(random.uniform(10.0, 35.0), 2),
        "turbidity_ntu": round(random.uniform(0.1, 100.0), 2),
        "wind_speed_ms": round(random.uniform(0.0, 20.0), 2),
        "pressure_hpa": round(random.uniform(980.0, 1050.0), 2),
        "sst_celsius": round(random.uniform(15.0, 32.0), 2),
        "wave_height_m": round(random.uniform(0.1, 5.0), 2),
        "rainfall_mm_hr": round(random.uniform(0.0, 50.0), 2),
        "water_level_cm": round(random.uniform(50.0, 300.0), 2),
        "tss_mg_l": round(random.uniform(5.0, 200.0), 2)
    }

# SQL query with UPSERT (Insert or Update)
sql = """
INSERT INTO ml_data (
    location_id, ts, chlorophyll_a_ug_l, do_mg_l, water_temp_c, turbidity_ntu,
    wind_speed_ms, pressure_hpa, sst_celsius, wave_height_m, rainfall_mm_hr,
    water_level_cm, tss_mg_l
) VALUES (
    %(location_id)s, %(ts)s, %(chlorophyll_a_ug_l)s, %(do_mg_l)s, %(water_temp_c)s,
    %(turbidity_ntu)s, %(wind_speed_ms)s, %(pressure_hpa)s, %(sst_celsius)s,
    %(wave_height_m)s, %(rainfall_mm_hr)s, %(water_level_cm)s, %(tss_mg_l)s
)
ON DUPLICATE KEY UPDATE
    ts = VALUES(ts),
    chlorophyll_a_ug_l = VALUES(chlorophyll_a_ug_l),
    do_mg_l = VALUES(do_mg_l),
    water_temp_c = VALUES(water_temp_c),
    turbidity_ntu = VALUES(turbidity_ntu),
    wind_speed_ms = VALUES(wind_speed_ms),
    pressure_hpa = VALUES(pressure_hpa),
    sst_celsius = VALUES(sst_celsius),
    wave_height_m = VALUES(wave_height_m),
    rainfall_mm_hr = VALUES(rainfall_mm_hr),
    water_level_cm = VALUES(water_level_cm),
    tss_mg_l = VALUES(tss_mg_l);
"""

# Get all locations from the `locations` table
cursor.execute("SELECT location_id FROM locations;")
locations = cursor.fetchall()

# Loop through each location and insert/update ml_data
for loc in locations:
    location_id = loc[0]  # since fetchall gives tuple like ('LOC001',)
    data = generate_random_data(location_id)
    cursor.execute(sql, data)
    conn.commit()
    print(f"Inserted/Updated data for {location_id}")

cursor.close()
conn.close()
