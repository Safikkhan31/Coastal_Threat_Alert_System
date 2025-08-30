import React from 'react';


const DefaultIcon = ({ className, size = 20 }) => (
  <span className={className} style={{ fontSize: size, lineHeight: 1 }}>⚠️</span>
);

const ThreatCard = ({ title, value, unit, risk, confidence, trend, icon: Icon, description }) => {
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low Risk': return 'bg-green-100 text-green-800';
      case 'Medium Risk': return 'bg-yellow-100 text-yellow-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {Icon ? <Icon className="text-blue-600 mr-3" size={24} /> : <DefaultIcon className="text-blue-600 mr-3" size={24} />}
          <h3 className="text-gray-700 font-medium">{title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk)}`}>
          {risk}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value} <span className="text-lg text-gray-600">{unit}</span>
        </div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        {confidence && (
          <div className="text-gray-600">
            {confidence}% confidence
          </div>
        )}
        <div className="flex items-center text-gray-600">
          <span className="mr-1">{getTrendIcon(trend)}</span>
          {trend}
        </div>
      </div>
    </div>
  );
};

export default ThreatCard;