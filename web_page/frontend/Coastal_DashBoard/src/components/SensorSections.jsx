import React from 'react';
import SensorCard from './SensorCard';
import { waterQualityData, weatherData, hydrologicalData } from '../data/sensorData';
import '../assets/styles.css';
const SensorSections = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-time Sensor Data</h2>
      
      {/* Water Quality Monitoring */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Water Quality Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {waterQualityData.map((sensor, index) => (
            <SensorCard key={index} {...sensor} />
          ))}
        </div>
      </div>

      {/* Weather Conditions */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Weather Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weatherData.map((sensor, index) => (
            <SensorCard key={index} {...sensor} />
          ))}
        </div>
      </div>

      {/* Hydrological Data */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Hydrological Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hydrologicalData.map((sensor, index) => (
            <SensorCard key={index} {...sensor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SensorSections;