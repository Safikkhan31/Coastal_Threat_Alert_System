import React from 'react';
import '../assets/styles.css';
const SensorCard = ({ title, value, unit, status, min, max, current, icon: Icon }) => {
  const percentage = ((current - min) / (max - min)) * 100;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>
      
      <div className="flex items-center mb-4">
        <Icon className="text-gray-500 mr-3" size={24} />
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-gray-500 text-sm">{unit}</div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min} {unit.split('/')[0]}</span>
        <span>{max} {unit.split('/')[0]}</span>
      </div>
    </div>
  );
};

export default SensorCard;