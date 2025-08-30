# Coastal Threat Alert System

## TECHNOLOGIES USED
1. Sensor Data Simulation
    a.Python – for writing the sensor simulation script
    b.Random / NumPy – for generating synthetic sensor values
2. AI/ML Model Processing
    a.Python – core language for AI/ML models
    b.scikit-learn – model building and prediction
    c.pandas & NumPy – data preprocessing and manipulation
    d.joblib / pickle – saving and loading trained models
3. Data Storage
    a.MySQL – relational database for storing sensor inputs and model outputs
    b.mysql-connector-python – Python library for database connectivity
4. Alert Management
    a.Java – for alert monitoring and SMS trigger system
    b.JDBC – Java Database Connectivity for MySQL
    c.Twilio API / SMS Gateway (if used) – sending SMS alerts (In the free version , the message is sent to only verified numbers.Therefore number registration system cannot be made.)
    d.Maven – for project build, dependency management, and packaging
5. Web Dashboard
    a.HTML, CSS, JavaScript – frontend visualization
    b.React / Node.js (if used) – backend server (choose whichever you used)
    

## Project Flow
1. Sensor Data Simulation
    Generates synthetic environmental data (e.g., water quality, weather, tide levels) instead of real sensors.

2. AI/ML Model Processing
    a. Illegal Dumping Detection → predicts dumping quantity from water quality metrics.
    b. Storm Surge & Cyclone Categorization → classifies cyclone category using wind, pressure, sea temp, and waves.
    c.Sea Level Rise & Flood Forecasting → predicts rising sea levels from tide, rainfall, and river discharge.
    d.Algal Bloom Prediction → estimates bloom risk using chlorophyll, DO, temp, and turbidity.

3. Data Storage (MySQL)
    Stores both simulated sensor inputs and AI/ML predictions for analysis and tracking.

4. Alert Management (Java App)
    Monitors predictions and sends SMS alerts to registered contacts on threshold breaches.

5. Web Dashboard
    Visualizes real-time sensor data and AI model outputs for monitoring and decision-making.



## Database Schema
### 1. `locations`
| Column       | Type        | Description |
|--------------|------------|-------------|
| location_id  | INT (PK)   | Unique ID for each location |
| location     | VARCHAR    | Name of the location |

### 2. `ml_data`
| Column              | Type     | Description |
|---------------------|----------|-------------|
| location_id (FK)    | INT      | Reference to `locations` |
| ts                  | DATETIME | Timestamp |
| chlorophyll_a_ug_l  | FLOAT    | Chlorophyll levels |
| do_mg_l             | FLOAT    | Dissolved oxygen |
| water_temp_c        | FLOAT    | Water temperature |
| turbidity_ntu       | FLOAT    | Turbidity |
| wind_speed_ms       | FLOAT    | Wind speed |
| pressure_hpa        | FLOAT    | Atmospheric pressure |
| sst_celsius         | FLOAT    | Sea surface temp |
| wave_height_m       | FLOAT    | Wave height |
| rainfall_mm_hr      | FLOAT    | Rainfall |
| water_level_cm      | FLOAT    | Water level |
| tss_mg_l            | FLOAT    | Total suspended solids |

Note: Parameters like **dumping_quantity, saffir_simpson_category, sea_level_rise, bloom_risk_score, risk_score** will be **generated later by ML model** and not stored at this stage.


## Impact of Coastal Threats on Blue Carbon Ecosystems

1. Illegal Dumping
    Waste discharge increases water pollution, harming mangroves and seagrasses. This reduces their growth and weakens their ability to capture and store carbon effectively.

2. Cyclones & Storm Surges
    Strong storms uproot mangroves and damage salt marshes. When these ecosystems are destroyed, the carbon stored in their soils and biomass is released back into the atmosphere.

3. Rising Sea Levels & Flooding
    Continuous flooding submerges Blue Carbon ecosystems like mangroves, marshes, and seagrasses. Over time, this limits their carbon sequestration potential and threatens their survival.

4. Algal Blooms
    Excessive algae growth blocks sunlight and lowers oxygen in water, killing seagrasses and other marine plants. This leads to a reduction in Blue Carbon storage and may release stored carbon.