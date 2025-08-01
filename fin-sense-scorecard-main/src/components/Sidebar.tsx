
import React from 'react';
import { FaChartLine, FaFileAlt, FaBell, FaLightbulb, FaCalculator, FaCreditCard, FaChartBar, FaLink, FaBuilding, FaLock, FaCog, FaGraduationCap, FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activeSection, onSectionChange, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Credit Score Overview', icon: FaChartLine },
    { id: 'report', label: 'Credit Report', icon: FaFileAlt },
    { id: 'alerts', label: 'Real-Time Alerts', icon: FaBell },
    { id: 'insights', label: 'Improvement Insights', icon: FaLightbulb },
    { id: 'simulator', label: 'Score Simulator', icon: FaCalculator },
    { id: 'recommendations', label: 'Product Recommendations', icon: FaCreditCard },
    { id: 'debt', label: 'Debt Tracker', icon: FaChartBar },
    { id: 'accounts', label: 'Linked Accounts', icon: FaLink },
    { id: 'bureaus', label: 'Bureau Comparison', icon: FaBuilding },
    { id: 'protection', label: 'Identity Protection', icon: FaLock },
    { id: 'settings', label: 'Settings', icon: FaCog },
    { id: 'learn', label: 'Learn Center', icon: FaGraduationCap },
  ];

  return (
    <div className="w-64 bg-white shadow-lg fixed h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-2xl font-bold text-navy font-sacrifice">Scorly</h1>
        <p className="text-sm text-gray-600 mt-1">User Dashboard</p>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full text-left flex items-center px-6 py-3 text-sm hover:bg-gray-50 transition-colors ${activeSection === item.id ? 'bg-navy text-white' : 'text-gray-700'
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

      {/* Logout - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onLogout}
          className="w-full text-left flex items-center px-2 py-3 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
