import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

const SystemStatus = ({ sensorsActive = 3, alertsPending = 3 }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Activity className="text-green-600 mr-3" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
              All Systems Operational
            </span>
            <span className="ml-4 text-gray-600">{sensorsActive} sensors active</span>
          </div>
          <div className="flex items-center text-gray-600">
            <AlertTriangle size={20} className="mr-2" />
            {alertsPending} alerts pending review
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;