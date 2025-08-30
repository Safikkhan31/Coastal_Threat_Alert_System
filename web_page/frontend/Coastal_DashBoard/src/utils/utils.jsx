// Time formatting utilities
import React from 'react';
import '../assets/styles.css';
export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Status and risk utility functions
export const getRiskColor = (risk) => {
  switch(risk) {
    case 'Low Risk': return 'bg-green-100 text-green-800';
    case 'Medium Risk': return 'bg-yellow-100 text-yellow-800';
    case 'High Risk': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status) => {
  switch(status) {
    case 'normal': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getTrendIcon = (trend) => {
  if (trend === 'up') return '↗';
  if (trend === 'down') return '↘';
  return '→';
};

// Data validation utilities
export const validateSensorData = (data) => {
  return data && typeof data.value !== 'undefined' && data.min !== undefined && data.max !== undefined;
};

export const calculatePercentage = (current, min, max) => {
  if (max === min) return 0;
  return ((current - min) / (max - min)) * 100;
};

// Alert generation utilities
export const generateAlert = (sensorData) => {
  const alerts = [];
  
  sensorData.forEach(sensor => {
    if (sensor.status === 'warning' || sensor.status === 'critical') {
      alerts.push({
        id: Math.random().toString(36).substr(2, 9),
        sensor: sensor.title,
        value: sensor.value,
        unit: sensor.unit,
        status: sensor.status,
        timestamp: new Date()
      });
    }
  });
  
  return alerts;
};

// System health check
export const checkSystemHealth = (sensors) => {
  const totalSensors = sensors.length;
  const activeSensors = sensors.filter(s => s.status !== 'offline').length;
  const criticalSensors = sensors.filter(s => s.status === 'critical').length;
  
  if (criticalSensors > 0) {
    return { status: 'critical', message: 'Critical sensors detected' };
  } else if (activeSensors < totalSensors) {
    return { status: 'warning', message: 'Some sensors offline' };
  } else {
    return { status: 'operational', message: 'All Systems Operational' };
  }
};