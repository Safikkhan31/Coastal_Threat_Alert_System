import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import '../assets/styles.css';
const Header = ({ currentTime, location = "Coastal Region Beta-7" }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Coastal Threat Alert System</h1>
            <p className="text-xl text-blue-100">AI-powered early detection and monitoring for coastal hazards</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-blue-100 mb-2">
              <MapPin size={16} className="mr-2" />
              {location}
            </div>
            <div className="flex items-center text-blue-100">
              <Clock size={16} className="mr-2" />
              Last updated: {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;