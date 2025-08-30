class PredictiveAnalytics {
  constructor() {
    this.models = {
      algalBloom: new AlgalBloomPredictor(),
      stormSurge: new StormSurgePredictor(),
      illegalDumping: new DumpingDetector(),
      waterQuality: new WaterQualityPredictor(),
      erosion: new CoastalErosionPredictor()
    };
    
    this.predictionCache = new Map();
    this.historicalData = [];
    this.modelPerformance = {};
  }

  // Main prediction engine
  async generateThreatPredictions(sensorData, weatherData, historicalData) {
    const predictions = [];
    
    for (const [modelName, model] of Object.entries(this.models)) {
      try {
        const prediction = await model.predict(sensorData, weatherData, historicalData);
        prediction.modelName = modelName;
        prediction.generatedAt = new Date();
        predictions.push(prediction);
      } catch (error) {
        console.error(`Error in ${modelName} prediction:`, error);
      }
    }

    // Cache predictions for performance
    this.predictionCache.set('latest', predictions);
    return predictions;
  }

  // Long-term forecast (7-30 days)
  async generateLongTermForecast(days = 7) {
    const forecast = {
      timeRange: `${days} days`,
      generatedAt: new Date(),
      predictions: []
    };

    // Get extended weather forecast
    const weatherForecast = await this.getWeatherForecast(days);
    
    for (let day = 1; day <= days; day++) {
      const dayForecast = {
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
        threats: await this.predictForDay(day, weatherForecast)
      };
      forecast.predictions.push(dayForecast);
    }

    return forecast;
  }

  // Real-time anomaly detection
  detectAnomalies(currentData, historicalBaseline) {
    const anomalies = [];
    
    for (const [sensor, value] of Object.entries(currentData)) {
      const baseline = historicalBaseline[sensor];
      if (baseline) {
        const deviation = this.calculateDeviation(value, baseline);
        
        if (deviation > 2) { // 2 standard deviations
          anomalies.push({
            sensor: sensor,
            currentValue: value,
            expectedRange: baseline.range,
            deviation: deviation,
            severity: deviation > 3 ? 'critical' : 'warning',
            confidence: Math.min(95, deviation * 30) // Convert to confidence %
          });
        }
      }
    }

    return anomalies;
  }

  // Machine learning model retraining
  async retrainModels(newData) {
    const retrainingResults = {};
    
    for (const [modelName, model] of Object.entries(this.models)) {
      try {
        console.log(`Retraining ${modelName} model...`);
        const result = await model.retrain(newData);
        retrainingResults[modelName] = {
          success: true,
          previousAccuracy: model.getAccuracy(),
          newAccuracy: result.accuracy,
          improvementPercent: result.accuracy - model.getAccuracy(),
          trainingTime: result.trainingTime
        };
      } catch (error) {
        retrainingResults[modelName] = {
          success: false,
          error: error.message
        };
      }
    }

    return retrainingResults;
  }

  // Model performance evaluation
  evaluateModelPerformance() {
    const performance = {};
    
    for (const [modelName, model] of Object.entries(this.models)) {
      performance[modelName] = {
        accuracy: model.getAccuracy(),
        precision: model.getPrecision(),
        recall: model.getRecall(),
        f1Score: model.getF1Score(),
        lastTrained: model.getLastTrainingDate(),
        predictionCount: model.getPredictionCount(),
        falsePositives: model.getFalsePositives(),
        falseNegatives: model.getFalseNegatives()
      };
    }

    this.modelPerformance = performance;
    return performance;
  }

  // Risk scoring algorithm
  calculateRiskScore(predictions) {
    let totalRisk = 0;
    let weightedSum = 0;
    
    const weights = {
      algalBloom: 0.7,
      stormSurge: 1.0,
      illegalDumping: 0.8,
      waterQuality: 0.9,
      erosion: 0.6
    };

    predictions.forEach(prediction => {
      const weight = weights[prediction.modelName] || 0.5;
      const riskValue = this.convertThreatToRisk(prediction);
      
      totalRisk += riskValue * weight;
      weightedSum += weight;
    });

    return Math.round((totalRisk / weightedSum) * 100) / 100;
  }

  // Utility methods
  calculateDeviation(value, baseline) {
    return Math.abs(value - baseline.mean) / baseline.stdDev;
  }

  convertThreatToRisk(prediction) {
    switch (prediction.risk?.toLowerCase()) {
      case 'low': return 0.2;
      case 'medium': return 0.5;
      case 'high': return 0.8;
      case 'critical': return 1.0;
      default: return 0.3;
    }
  }

  async getWeatherForecast(days) {
    // Simulate weather API call
    return {
      temperature: Array(days).fill().map(() => 20 + Math.random() * 10),
      precipitation: Array(days).fill().map(() => Math.random() * 20),
      windSpeed: Array(days).fill().map(() => 5 + Math.random() * 15),
      pressure: Array(days).fill().map(() => 1000 + Math.random() * 50)
    };
  }

  async predictForDay(dayOffset, weatherForecast) {
    // Simplified prediction for demonstration
    return {
      algalBloomRisk: Math.random() * 0.3,
      stormSurgeRisk: Math.random() * 0.2,
      waterQualityRisk: Math.random() * 0.4
    };
  }
}

// Individual prediction models
class AlgalBloomPredictor {
  constructor() {
    this.accuracy = 0.85;
    this.lastTrained = new Date();
    this.predictionCount = 0;
  }

  async predict(sensorData, weatherData) {
    this.predictionCount++;
    
    // Simplified prediction logic
    const chlorophyll = sensorData.waterQuality?.chlorophyll || 0;
    const temperature = weatherData.temperature || 20;
    const nutrients = sensorData.waterQuality?.nitrogen || 0;

    const riskScore = (chlorophyll * 0.4 + temperature * 0.3 + nutrients * 0.3) / 100;
    
    return {
      type: 'Algal Bloom Risk',
      risk: riskScore > 0.6 ? 'High' : riskScore > 0.3 ? 'Medium' : 'Low',
      confidence: Math.round(this.accuracy * 100),
      factors: ['High chlorophyll-a levels', 'Elevated water temperature', 'Nutrient loading'],
      timeframe: '24-72 hours',
      location: 'Coastal monitoring zone'
    };
  }

  async retrain(newData) {
    // Simulate retraining
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.accuracy += (Math.random() - 0.5) * 0.1;
    this.lastTrained = new Date();
    
    return {
      accuracy: this.accuracy,
      trainingTime: 2000
    };
  }

  getAccuracy() { return this.accuracy; }
  getPrecision() { return this.accuracy * 0.95; }
  getRecall() { return this.accuracy * 0.90; }
  getF1Score() { return (this.getPrecision() * this.getRecall() * 2) / (this.getPrecision() + this.getRecall()); }
  getLastTrainingDate() { return this.lastTrained; }
  getPredictionCount() { return this.predictionCount; }
  getFalsePositives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.6); }
  getFalseNegatives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.4); }
}

class StormSurgePredictor {
  constructor() {
    this.accuracy = 0.92;
    this.lastTrained = new Date();
    this.predictionCount = 0;
  }

  async predict(sensorData, weatherData) {
    this.predictionCount++;
    
    const pressure = weatherData.atmosphericPressure || 1013;
    const windSpeed = weatherData.windSpeed || 0;
    const waveHeight = sensorData.hydrological?.waveHeight || 0;
    const tideLevel = sensorData.hydrological?.tideGauge || 200;

    // Storm surge risk calculation
    const pressureFactor = pressure < 980 ? 0.8 : pressure < 1000 ? 0.4 : 0.1;
    const windFactor = windSpeed > 20 ? 0.9 : windSpeed > 10 ? 0.5 : 0.2;
    const waveFactor = waveHeight > 3 ? 0.8 : waveHeight > 1.5 ? 0.4 : 0.1;
    
    const riskScore = (pressureFactor + windFactor + waveFactor) / 3;
    
    return {
      type: 'Storm Surge Risk',
      risk: riskScore > 0.6 ? 'High' : riskScore > 0.3 ? 'Medium' : 'Low',
      confidence: Math.round(this.accuracy * 100),
      factors: ['Low atmospheric pressure', 'High wind speeds', 'Elevated wave heights'],
      timeframe: '6-24 hours',
      location: 'Coastal zone A-C',
      category: Math.ceil(riskScore * 5) // Saffir-Simpson like scale
    };
  }

  async retrain(newData) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.accuracy += (Math.random() - 0.5) * 0.05;
    this.lastTrained = new Date();
    
    return {
      accuracy: this.accuracy,
      trainingTime: 3000
    };
  }

  getAccuracy() { return this.accuracy; }
  getPrecision() { return this.accuracy * 0.98; }
  getRecall() { return this.accuracy * 0.88; }
  getF1Score() { return (this.getPrecision() * this.getRecall() * 2) / (this.getPrecision() + this.getRecall()); }
  getLastTrainingDate() { return this.lastTrained; }
  getPredictionCount() { return this.predictionCount; }
  getFalsePositives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.5); }
  getFalseNegatives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.5); }
}

class DumpingDetector {
  constructor() {
    this.accuracy = 0.78;
    this.lastTrained = new Date();
    this.predictionCount = 0;
  }

  async predict(sensorData, weatherData) {
    this.predictionCount++;
    
    const turbidity = sensorData.waterQuality?.turbidity || 0;
    const dissolvedOxygen = sensorData.waterQuality?.dissolvedOxygen || 8;
    const suspendedSolids = sensorData.waterQuality?.totalSuspendedSolids || 0;
    
    // Anomaly detection for illegal dumping
    const turbidityAnomaly = turbidity > 40 ? 0.8 : turbidity > 25 ? 0.4 : 0.1;
    const oxygenAnomaly = dissolvedOxygen < 6 ? 0.7 : dissolvedOxygen < 7 ? 0.3 : 0.1;
    const solidsAnomaly = suspendedSolids > 80 ? 0.9 : suspendedSolids > 60 ? 0.5 : 0.2;
    
    const detectionScore = (turbidityAnomaly + oxygenAnomaly + solidsAnomaly) / 3;
    
    return {
      type: 'Illegal Dumping Detection',
      risk: detectionScore > 0.5 ? 'High' : detectionScore > 0.3 ? 'Medium' : 'Low',
      confidence: Math.round(this.accuracy * 100),
      factors: ['Elevated turbidity', 'Reduced dissolved oxygen', 'High suspended solids'],
      timeframe: 'Current',
      location: 'Sensor network area',
      estimatedVolume: `${(detectionScore * 50).toFixed(1)} kg`
    };
  }

  async retrain(newData) {
    await new Promise(resolve => setTimeout(resolve, 4000));
    this.accuracy += (Math.random() - 0.5) * 0.15;
    this.lastTrained = new Date();
    
    return {
      accuracy: this.accuracy,
      trainingTime: 4000
    };
  }

  getAccuracy() { return this.accuracy; }
  getPrecision() { return this.accuracy * 0.85; }
  getRecall() { return this.accuracy * 0.92; }
  getF1Score() { return (this.getPrecision() * this.getRecall() * 2) / (this.getPrecision() + this.getRecall()); }
  getLastTrainingDate() { return this.lastTrained; }
  getPredictionCount() { return this.predictionCount; }
  getFalsePositives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.7); }
  getFalseNegatives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.3); }
}

class WaterQualityPredictor {
  constructor() {
    this.accuracy = 0.88;
    this.lastTrained = new Date();
    this.predictionCount = 0;
  }

  async predict(sensorData, weatherData) {
    this.predictionCount++;
    
    const rainfall = weatherData.rainfall || 0;
    const temperature = weatherData.temperature || 20;
    const riverDischarge = sensorData.hydrological?.riverDischarge || 100;
    
    // Water quality degradation prediction
    const rainfallImpact = rainfall > 20 ? 0.7 : rainfall > 10 ? 0.4 : 0.1;
    const temperatureImpact = temperature > 25 ? 0.6 : temperature > 20 ? 0.3 : 0.1;
    const dischargeImpact = riverDischarge > 150 ? 0.8 : riverDischarge > 120 ? 0.4 : 0.1;
    
    const degradationRisk = (rainfallImpact + temperatureImpact + dischargeImpact) / 3;
    
    return {
      type: 'Water Quality Degradation',
      risk: degradationRisk > 0.5 ? 'High' : degradationRisk > 0.3 ? 'Medium' : 'Low',
      confidence: Math.round(this.accuracy * 100),
      factors: ['Heavy rainfall', 'Elevated temperature', 'High river discharge'],
      timeframe: '12-48 hours',
      location: 'Water monitoring stations',
      affectedParameters: ['Turbidity', 'Dissolved Oxygen', 'Bacterial Load']
    };
  }

  async retrain(newData) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    this.accuracy += (Math.random() - 0.5) * 0.08;
    this.lastTrained = new Date();
    
    return {
      accuracy: this.accuracy,
      trainingTime: 2500
    };
  }

  getAccuracy() { return this.accuracy; }
  getPrecision() { return this.accuracy * 0.91; }
  getRecall() { return this.accuracy * 0.86; }
  getF1Score() { return (this.getPrecision() * this.getRecall() * 2) / (this.getPrecision() + this.getRecall()); }
  getLastTrainingDate() { return this.lastTrained; }
  getPredictionCount() { return this.predictionCount; }
  getFalsePositives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.6); }
  getFalseNegatives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.4); }
}

class CoastalErosionPredictor {
  constructor() {
    this.accuracy = 0.82;
    this.lastTrained = new Date();
    this.predictionCount = 0;
  }

  async predict(sensorData, weatherData) {
    this.predictionCount++;
    
    const waveHeight = sensorData.hydrological?.waveHeight || 0;
    const windSpeed = weatherData.windSpeed || 0;
    const tideLevel = sensorData.hydrological?.tideGauge || 200;
    
    // Erosion risk calculation
    const waveImpact = waveHeight > 2 ? 0.8 : waveHeight > 1 ? 0.4 : 0.1;
    const windImpact = windSpeed > 15 ? 0.6 : windSpeed > 8 ? 0.3 : 0.1;
    const tideImpact = tideLevel > 400 ? 0.7 : tideLevel > 300 ? 0.4 : 0.2;
    
    const erosionRisk = (waveImpact + windImpact + tideImpact) / 3;
    
    return {
      type: 'Coastal Erosion Risk',
      risk: erosionRisk > 0.5 ? 'High' : erosionRisk > 0.3 ? 'Medium' : 'Low',
      confidence: Math.round(this.accuracy * 100),
      factors: ['High wave energy', 'Strong winds', 'Elevated tide levels'],
      timeframe: '1-7 days',
      location: 'Shoreline monitoring points',
      estimatedImpact: `${(erosionRisk * 10).toFixed(1)} cm potential retreat`
    };
  }

  async retrain(newData) {
    await new Promise(resolve => setTimeout(resolve, 3500));
    this.accuracy += (Math.random() - 0.5) * 0.12;
    this.lastTrained = new Date();
    
    return {
      accuracy: this.accuracy,
      trainingTime: 3500
    };
  }

  getAccuracy() { return this.accuracy; }
  getPrecision() { return this.accuracy * 0.87; }
  getRecall() { return this.accuracy * 0.89; }
  getF1Score() { return (this.getPrecision() * this.getRecall() * 2) / (this.getPrecision() + this.getRecall()); }
  getLastTrainingDate() { return this.lastTrained; }
  getPredictionCount() { return this.predictionCount; }
  getFalsePositives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.5); }
  getFalseNegatives() { return Math.round(this.predictionCount * (1 - this.accuracy) * 0.5); }
}

// Data preprocessing utilities
export const DataProcessor = {
  // Clean and normalize sensor data
  preprocessSensorData(rawData) {
    const cleaned = {};
    
    for (const [category, sensors] of Object.entries(rawData)) {
      cleaned[category] = {};
      
      for (const [sensor, value] of Object.entries(sensors)) {
        // Remove outliers using IQR method
        cleaned[category][sensor] = this.removeOutliers(value);
        
        // Normalize values to 0-1 range
        cleaned[category][sensor] = this.normalize(cleaned[category][sensor]);
      }
    }
    
    return cleaned;
  },

  removeOutliers(data) {
    if (!Array.isArray(data)) return data;
    
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return data.filter(value => value >= lowerBound && value <= upperBound);
  },

  normalize(data) {
    if (!Array.isArray(data)) return data;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    if (range === 0) return data;
    
    return data.map(value => (value - min) / range);
  },

  // Feature engineering for ML models
  extractFeatures(sensorData, weatherData, timeWindow = 24) {
    return {
      // Statistical features
      mean: this.calculateMean(sensorData),
      stdDev: this.calculateStdDev(sensorData),
      trend: this.calculateTrend(sensorData, timeWindow),
      
      // Time-based features
      hourOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      seasonality: this.calculateSeasonality(),
      
      // Environmental correlations
      temperatureCorrelation: this.calculateCorrelation(sensorData.temperature, weatherData.temperature),
      pressureCorrelation: this.calculateCorrelation(sensorData.pressure, weatherData.pressure)
    };
  },

  calculateMean(data) {
    if (!Array.isArray(data)) return 0;
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  },

  calculateStdDev(data) {
    if (!Array.isArray(data)) return 0;
    const mean = this.calculateMean(data);
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    return Math.sqrt(this.calculateMean(squaredDiffs));
  },

  calculateTrend(data, timeWindow) {
    if (!Array.isArray(data) || data.length < 2) return 0;
    
    const recent = data.slice(-timeWindow);
    const x = recent.map((_, i) => i);
    const y = recent;
    
    // Simple linear regression slope
    const n = recent.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  },

  calculateSeasonality() {
    const month = new Date().getMonth();
    return Math.sin(2 * Math.PI * month / 12); // Seasonal component
  },

  calculateCorrelation(data1, data2) {
    if (!Array.isArray(data1) || !Array.isArray(data2) || data1.length !== data2.length) {
      return 0;
    }
    
    const mean1 = this.calculateMean(data1);
    const mean2 = this.calculateMean(data2);
    
    const numerator = data1.reduce((sum, val, i) => sum + (val - mean1) * (data2[i] - mean2), 0);
    const denominator = Math.sqrt(
      data1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
      data2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
    );
    
    return denominator === 0 ? 0 : numerator / denominator;
  }
};

export default new PredictiveAnalytics();