
import React, { useState } from 'react';
import { FaUsers, FaExclamationTriangle, FaChartLine, FaFileAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import SystemOverview from '@/components/admin/SystemOverview';
import UserManagement from '@/components/admin/UserManagement';
import SystemAlerts from '@/components/admin/SystemAlerts';
import SystemSettings from '@/components/admin/SystemSettings';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = () => {
    onLogout();
  };

  const sidebarItems = [
    { id: 'overview', label: 'System Overview', icon: FaChartLine },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'alerts', label: 'System Alerts', icon: FaExclamationTriangle },
    { id: 'reports', label: 'Reports & Analytics', icon: FaFileAlt },
    { id: 'settings', label: 'System Settings', icon: FaCog },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <SystemOverview />;
      case 'users':
        return <UserManagement />;
      case 'alerts':
        return <SystemAlerts />;
      case 'reports':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">System reports and analytics coming soon...</p>
          </div>
        );
      case 'settings':
        return <SystemSettings />;
      default:
        return <SystemOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-navy text-white shadow-lg fixed h-full flex flex-col">
        <div className="p-6 border-b border-navy-light flex-shrink-0">
          <h1 className="text-2xl font-bold font-sacrifice">Scorly</h1>
          <p className="text-navy-light text-sm mt-1">System Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-4">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-6 py-3 text-left hover:bg-navy-light transition-colors ${
                      activeSection === item.id ? 'bg-navy-light border-r-2 border-white' : ''
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-navy-light bg-navy flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-white hover:bg-navy-light"
          >
            <FaSignOutAlt className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
