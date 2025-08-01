
import React from 'react';
import { FaUsers, FaExclamationTriangle, FaChartLine, FaDatabase } from 'react-icons/fa';

const SystemOverview = () => {
  const stats = [
    { label: 'Total Users', value: '12,453', change: '+125', icon: FaUsers, color: 'blue' },
    { label: 'Active Today', value: '3,241', change: '+89', icon: FaChartLine, color: 'green' },
    { label: 'Credit Reports Pulled', value: '8,765', change: '+234', icon: FaDatabase, color: 'purple' },
    { label: 'Alerts Triggered', value: '156', change: '+12', icon: FaExclamationTriangle, color: 'red' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', joined: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', joined: '2024-01-14', status: 'Active' },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', joined: '2024-01-13', status: 'Suspended' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@example.com', joined: '2024-01-12', status: 'Active' },
  ];

  const recentAlerts = [
    { id: 1, type: 'Fraud', message: 'Suspicious login attempt detected', user: 'john@example.com', time: '2 hours ago' },
    { id: 2, type: 'System', message: 'Credit bureau API response time high', time: '4 hours ago' },
    { id: 3, type: 'Security', message: 'Multiple failed login attempts', user: 'unknown@email.com', time: '6 hours ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h1>
        <p className="text-gray-600">Monitor and manage your credit score application</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} this week
                  </p>
                </div>
                <IconComponent className={`w-8 h-8 text-${stat.color}-500`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Joined {user.joined}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">System Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'Fraud' ? 'bg-red-500' :
                    alert.type === 'System' ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.type === 'Fraud' ? 'bg-red-100 text-red-800' :
                        alert.type === 'System' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm text-gray-900 mt-1">{alert.message}</p>
                    {alert.user && (
                      <p className="text-xs text-gray-600 mt-1">User: {alert.user}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
