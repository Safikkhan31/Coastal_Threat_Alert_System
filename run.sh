#!/bin/bash

while true; do
    # Start sensor generator in background
    python sensor_data_generator/sensor.py

    # Start AI models in background
    python AI_models/DatabaseManagment.py

    # Start Java alert service in foreground
    java -jar ./messege/target/messege-1.0-SNAPSHOT.jar
    sleep 86400   # wait 24 hours
done


