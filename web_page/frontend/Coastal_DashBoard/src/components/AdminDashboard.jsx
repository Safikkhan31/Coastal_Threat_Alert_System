import React, { useState } from 'react';
import { 
  Settings, Users, Bell, Shield, Database, FileText, 
  AlertTriangle, CheckCircle, XCircle, Send, Phone,
  Calendar, BarChart3, Map, Download, Upload
} from 'lucide-react';
import '../assets/styles.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  const pendingAlerts = [
    { id: 1, type: 'High Chlorophyll-a', location: 'Sensor Station A-7', time: '2 min ago', severity: 'warning', acknowledged: false },
    { id: 2, type: 'River Discharge Spike', location: 'Sensor Station B-3', time: '5 min ago', severity: 'warning', acknowledged: false },
    { id: 3, type: 'Illegal Dumping Detected', location: 'Coastal Zone C-12', time: '8 min ago', severity: 'critical', acknowledged: false }
  ];

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon size={18} className="mr-2" />
      {label}
    </button>
  );

  const AlertManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Alert Management</h3>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Send size={16} className="inline mr-2" />
            Send Broadcast
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Acknowledge Selected
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Pending Alerts ({pendingAlerts.length})</h4>
            <button className="text-blue-600 hover:text-blue-800">Select All</button>
          </div>
        </div>
        
        <div className="divide-y">
          {pendingAlerts.map(alert => (
            <div key={alert.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAlerts([...selectedAlerts, alert.id]);
                      } else {
                        setSelectedAlerts(selectedAlerts.filter(id => id !== alert.id));
                      }
                    }}
                  />
                  <div className={`w-3 h-3 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{alert.type}</div>
                    <div className="text-sm text-gray-600">{alert.location} • {alert.time}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                    View Details
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200">
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EmergencyResponse = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Emergency Response Center</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">Quick Response Actions</h4>
          <div className="space-y-3">
            <button className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center">
              <AlertTriangle size={18} className="mr-2" />
              Activate Emergency Protocol
            </button>
            <button className="w-full p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center">
              <Phone size={18} className="mr-2" />
              Contact Emergency Services
            </button>
            <button className="w-full p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center">
              <Bell size={18} className="mr-2" />
              Issue Public Warning
            </button>
            <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
              <Users size={18} className="mr-2" />
              Mobilize Response Team
            </button>
          </div>
        </div>

        {/* Communication Center */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">Communication Center</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Broadcast Message</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows="4"
                placeholder="Type emergency message..."
              ></textarea>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 p-2 bg-red-600 text-white rounded hover:bg-red-700">
                Emergency Alert
              </button>
              <button className="flex-1 p-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                Warning Notice
              </button>
              <button className="flex-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Information Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SensorManagement = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Sensor Network Management</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor Status */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">Sensor Network Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Water Quality Sensors</span>
              <span className="text-green-600 font-medium">4/4 Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weather Stations</span>
              <span className="text-green-600 font-medium">3/3 Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tide Gauges</span>
              <span className="text-yellow-600 font-medium">2/3 Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">AI Processing Units</span>
              <span className="text-green-600 font-medium">2/2 Online</span>
            </div>
          </div>
        </div>

        {/* Calibration */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">Sensor Calibration</h4>
          <div className="space-y-3">
            <button className="w-full p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
              Auto-Calibrate All Sensors
            </button>
            <button className="w-full p-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
              Manual Calibration Mode
            </button>
            <button className="w-full p-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200">
              Schedule Maintenance
            </button>
            <div className="text-sm text-gray-600 mt-3">
              Last calibration: 2 days ago
            </div>
          </div>
        </div>

        {/* Threshold Settings */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">Alert Thresholds</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600">Chlorophyll-a Warning (µg/L)</label>
              <input type="number" className="w-full p-2 border rounded" defaultValue="30" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Wave Height Critical (m)</label>
              <input type="number" className="w-full p-2 border rounded" defaultValue="5" />
            </div>
            <button className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700">
              Update Thresholds
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DataAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Data Analytics & Reports</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Data */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">Data Export</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>All Sensor Data</option>
                <option>Water Quality Only</option>
                <option>Weather Data Only</option>
                <option>Threat Predictions</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                <Download size={16} className="inline mr-2" />
                Export CSV
              </button>
              <button className="flex-1 p-2 bg-green-600 text-white rounded hover:bg-green-700">
                <FileText size={16} className="inline mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">AI Model Management</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Algal Bloom Prediction</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Storm Surge Model</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Dumping Detection AI</span>
              <span className="text-yellow-600 font-medium">Training</span>
            </div>
            <button className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Retrain Models
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">User & Access Management</h3>
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Active Users</h4>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add New User
            </button>
          </div>
        </div>
        
        <div className="divide-y">
          {[
            { name: 'Dr. Sarah Chen', role: 'Marine Biologist', status: 'online', lastActive: '2 min ago' },
            { name: 'Mike Rodriguez', role: 'Emergency Coordinator', status: 'online', lastActive: '5 min ago' },
            { name: 'Dr. James Park', role: 'Environmental Engineer', status: 'offline', lastActive: '2 hours ago' },
            { name: 'Lisa Thompson', role: 'Data Analyst', status: 'online', lastActive: '1 min ago' }
          ].map((user, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.role} • {user.lastActive}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200">
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">System Configuration</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Settings */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">Alert Configuration</h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-gray-700">Email Notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-gray-700">SMS Alerts</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-700">Webhook Integration</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alert Frequency</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Immediate</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Hourly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h4 className="font-medium mb-4">Data Management</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>30 Days</option>
                <option>90 Days</option>
                <option>1 Year</option>
                <option>5 Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <Database size={16} className="inline mr-2" />
              Backup Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'alerts': return <AlertManagement />;
      case 'emergency': return <EmergencyResponse />;
      case 'sensors': return <SensorManagement />;
      case 'analytics': return <DataAnalytics />;
      case 'users': return <UserManagement />;
      case 'settings': return <SystemSettings />;
      default: return <AlertManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-blue-600 mr-3" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Administrator: John Smith</span>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-4 py-4 overflow-x-auto">
            <TabButton id="alerts" label="Alert Management" icon={Bell} isActive={activeTab === 'alerts'} onClick={setActiveTab} />
            <TabButton id="emergency" label="Emergency Response" icon={AlertTriangle} isActive={activeTab === 'emergency'} onClick={setActiveTab} />
            <TabButton id="sensors" label="Sensor Management" icon={Settings} isActive={activeTab === 'sensors'} onClick={setActiveTab} />
            <TabButton id="analytics" label="Data Analytics" icon={BarChart3} isActive={activeTab === 'analytics'} onClick={setActiveTab} />
            <TabButton id="users" label="User Management" icon={Users} isActive={activeTab === 'users'} onClick={setActiveTab} />
            <TabButton id="settings" label="System Settings" icon={Settings} isActive={activeTab === 'settings'} onClick={setActiveTab} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;