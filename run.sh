#!/bin/bash

# Start sensor generator in background
python sensor_data_generator/sensor.py

# Start AI models in background
python AI_models/DatabaseManagment.py

# Start Java alert service in foreground
java -jar app.jar

