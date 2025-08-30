import { Droplets, Wind, Thermometer, Waves, Activity, AlertTriangle } from 'lucide-react';

// Water Quality Monitoring Data
export const waterQualityData = [
  {
    title: "Total Suspended Solids",
    value: "58.7",
    unit: "mg/L",
    status: "normal",
    min: 0,
    max: 100,
    current: 58.7,
    icon: Droplets
  },
  {
    title: "Turbidity",
    value: "24.7",
    unit: "NTU",
    status: "normal",
    min: 0,
    max: 50,
    current: 24.7,
    icon: Droplets
  },
  {
    title: "Dissolved Oxygen",
    value: "8.1",
    unit: "mg/L",
    status: "normal",
    min: 0,
    max: 15,
    current: 8.1,
    icon: Droplets
  },
  {
    title: "Chlorophyll-a",
    value: "34.7",
    unit: "µg/L",
    status: "warning",
    min: 0,
    max: 100,
    current: 34.7,
    icon: Droplets
  }
];

// Weather Conditions Data
export const weatherData = [
  {
    title: "Wind Speed",
    value: "11.4",
    unit: "m/s",
    status: "normal",
    min: 0,
    max: 50,
    current: 11.4,
    icon: Wind
  },
  {
    title: "Atmospheric Pressure",
    value: "1036.3",
    unit: "hPa",
    status: "normal",
    min: 950,
    max: 1050,
    current: 1036.3,
    icon: Activity
  },
  {
    title: "Sea Surface Temperature",
    value: "23.2",
    unit: "°C",
    status: "warning",
    min: 15,
    max: 35,
    current: 23.2,
    icon: Thermometer
  },
  {
    title: "Wave Height",
    value: "0.8",
    unit: "m",
    status: "normal",
    min: 0,
    max: 10,
    current: 0.8,
    icon: Waves
  }
];

// Hydrological Data
export const hydrologicalData = [
  {
    title: "Tide Gauge",
    value: "297.9",
    unit: "cm",
    status: "normal",
    min: 0,
    max: 500,
    current: 297.9,
    icon: Waves
  },
  {
    title: "Rainfall",
    value: "11.3",
    unit: "mm/hr",
    status: "normal",
    min: 0,
    max: 50,
    current: 11.3,
    icon: Droplets
  },
  {
    title: "River Discharge",
    value: "114.5",
    unit: "m³/s",
    status: "warning",
    min: 0,
    max: 500,
    current: 114.5,
    icon: Activity
  }
];

// AI Threat Predictions Data
export const threatData = [
  {
    title: "Illegal Dumping Detection",
    value: "13.2",
    unit: "kg",
    risk: "Medium Risk",
    confidence: "74",
    trend: "up",
    icon: AlertTriangle,
    description: "Above baseline"
  },
  {
    title: "Storm Surge Risk",
    value: "2",
    unit: "Category",
    risk: "Low Risk",
    trend: "stable",
    icon: Waves,
    description: "Saffir-Simpson scale"
  },
  {
    title: "Sea Level Rise",
    value: "24.3",
    unit: "cm",
    risk: "Low Risk",
    trend: "up",
    icon: Activity,
    description: "Above baseline"
  },
  {
    title: "Algal Bloom Risk",
    value: "12",
    unit: "%",
    risk: "Low Risk",
    trend: "down",
    icon: Droplets,
    description: "Low intensity"
  }
];