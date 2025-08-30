import React, { useState, useEffect } from 'react';
import Header from "./components/Header.jsx";
import SystemStatus from "./components/SystemStatus.jsx";
import SensorSections from "./components/SensorSections.jsx";
import ThreatPredictions from './components/ThreatCard.jsx';
import './assets/styles.css';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="dashboard-container">
        <header>
          <h1>Coastal Threat Alert Dashboard</h1>
          <p>Real-time monitoring of coastal hazards</p>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <Header currentTime={currentTime} />
          <SystemStatus />
          <SensorSections />
          <ThreatPredictions />
        </div>

        <footer>
          <small>&copy; 2025 Coastal Threat Alert System</small>
        </footer>
      </div>
    </div>
  );
};

export default App;
// ...existing code...
