#!/bin/bash

# Start sensor_data_generator in background
python3 sensor_data_generator/sensor.py &

# Start AI_models DatabaseManagement in background
python3 AI_models/DatabaseManagment.py &

# Start Java alert service in foreground
java -jar messege_manager/message_manager-1.0-SNAPSHOT.jar
