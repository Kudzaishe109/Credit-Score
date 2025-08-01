
import React, { useState } from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { Button } from "@/components/ui/button";

const SystemAlerts = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const alerts = [
    { id: 1, type: 'Fraud', severity: 'High', message: 'Multiple suspicious login attempts detected from IP 192.168.1.1', user: 'john@gmail.com', time: '2 hours ago', status: 'Open' },
    { id: 2, type: 'System', severity: 'Medium', message: 'Credit bureau API response time exceeding 5 seconds', time: '4 hours ago', status: 'Investigating' },
    { id: 3, type: 'Security', severity: 'High', message: 'Unauthorized access attempt to admin panel', user: 'unknown@email.com', time: '6 hours ago', status: 'Resolved' },
    { id: 4, type: 'Performance', severity: 'Low', message: 'Database query optimization needed for user reports', time: '1 day ago', status: 'Open' },
    { id: 5, type: 'Fraud', severity: 'Medium', message: 'Unusual credit score patterns detected for multiple users', time: '2 days ago', status: 'Resolved' },
  ];

  const filteredAlerts = filterStatus === 'all' ? alerts : alerts.filter(alert => alert.status.toLowerCase() === filterStatus);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'Investigating': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Alerts</h1>
        <p className="text-gray-600">Monitor and manage system alerts and security issues</p>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Open Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'Open').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaEye className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Investigating</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'Investigating').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'Resolved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.severity === 'High').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'open', 'investigating', 'resolved'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? "bg-navy hover:bg-navy-dark" : ""}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Alerts ({filteredAlerts.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                    <span className="text-xs text-gray-500">{alert.type}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{alert.time}</span>
                    {alert.user && <span>User: {alert.user}</span>}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="ghost">
                    <FaEye className="w-4 h-4" />
                  </Button>
                  {alert.status === 'Open' && (
                    <Button size="sm" variant="ghost" className="text-green-600">
                      <FaCheck className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-red-600">
                    <FaTimes className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemAlerts;
