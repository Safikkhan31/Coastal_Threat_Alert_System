# Use OpenJDK 17 as base
FROM openjdk:17-slim

# Install Python 3 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY sensor_data_generator/ sensor_data_generator/
COPY AI_models/ AI_models/
COPY messege/target/messege-1.0-SNAPSHOT.jar app.jar

# Copy Python requirements and install
COPY requirenments.txt .
RUN pip3 install --no-cache-dir -r requirenments.txt

# Copy the run script and give execute permission
COPY run.sh .
RUN chmod +x run.sh

# Set entrypoint to run.sh
ENTRYPOINT ["./run.sh"]
