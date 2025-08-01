
import React, { useState } from 'react';
import { FaUsers, FaChartLine, FaBell, FaCog, FaSignOutAlt, FaCreditCard, FaHandshake, FaShieldAlt, FaClipboardList, FaFileAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import BankOverview from '@/components/bank/BankOverview';
import CustomerManagement from '@/components/bank/CustomerManagement';
import LoanOffers from '@/components/bank/LoanOffers';

interface BankAdminDashboardProps {
  onLogout: () => void;
  bankName: string;
}

const BankAdminDashboard = ({ onLogout, bankName }: BankAdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = () => {
    onLogout();
  };

  const sidebarItems = [
    { id: 'overview', label: 'Bank Overview', icon: FaChartLine },
    { id: 'customers', label: 'Customer Management', icon: FaUsers },
    { id: 'credit-eligibility', label: 'Credit Eligibility', icon: FaCreditCard },
    { id: 'loan-offers', label: 'Loan & Card Offers', icon: FaHandshake },
    { id: 'compliance', label: 'Compliance & Reporting', icon: FaShieldAlt },
    { id: 'notifications', label: 'Customer Communications', icon: FaBell },
    { id: 'audit', label: 'Audit Logs', icon: FaClipboardList },
    { id: 'content', label: 'Content Management', icon: FaFileAlt },
    { id: 'settings', label: 'Bank Settings', icon: FaCog },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <BankOverview bankName={bankName} />;
      case 'customers':
        return <CustomerManagement />;
      case 'credit-eligibility':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Eligibility</h1>
            <p className="text-gray-600">Assess customer credit eligibility and set criteria...</p>
          </div>
        );
      case 'loan-offers':
        return <LoanOffers />;
      case 'compliance':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance & Reporting</h1>
            <p className="text-gray-600">Regulatory compliance and reporting tools...</p>
          </div>
        );
      case 'notifications':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Communications</h1>
            <p className="text-gray-600">Manage customer notifications and communications...</p>
          </div>
        );
      case 'audit':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
            <p className="text-gray-600">View system audit logs and activity tracking...</p>
          </div>
        );
      case 'content':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">Manage educational content and resources...</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Settings</h1>
            <p className="text-gray-600">Configure bank-specific settings and preferences...</p>
          </div>
        );
      default:
        return <BankOverview bankName={bankName} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-navy text-white shadow-lg fixed h-full flex flex-col">
        <div className="p-6 border-b border-navy-light flex-shrink-0">
          <h1 className="text-2xl font-bold font-sacrifice">Scorly</h1>
          <p className="text-navy-light text-sm mt-1">{bankName}</p>
          <p className="text-xs text-navy-light">Bank Admin Dashboard</p>
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

export default BankAdminDashboard;
