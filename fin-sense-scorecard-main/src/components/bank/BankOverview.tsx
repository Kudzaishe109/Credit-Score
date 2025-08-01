
import React from 'react';
import { FaUsers, FaCreditCard, FaHandshake, FaShieldAlt } from 'react-icons/fa';

interface BankOverviewProps {
  bankName: string;
}

const BankOverview = ({ bankName }: BankOverviewProps) => {
  const stats = [
    { label: 'Active Customers', value: '8,432', change: '+156', icon: FaUsers, color: 'blue' },
    { label: 'Credit Applications', value: '1,234', change: '+45', icon: FaCreditCard, color: 'green' },
    { label: 'Loan Offers Sent', value: '567', change: '+23', icon: FaHandshake, color: 'purple' },
    { label: 'Compliance Alerts', value: '12', change: '-3', icon: FaShieldAlt, color: 'red' },
  ];

  const recentCustomers = [
    { id: 1, name: 'John Mukamuri', creditScore: 720, status: 'Excellent', lastActivity: '2 hours ago' },
    { id: 2, name: 'Sarah Chikwanha', creditScore: 680, status: 'Good', lastActivity: '5 hours ago' },
    { id: 3, name: 'Michael Ndoro', creditScore: 620, status: 'Fair', lastActivity: '1 day ago' },
    { id: 4, name: 'Grace Moyo', creditScore: 750, status: 'Excellent', lastActivity: '2 days ago' },
  ];

  const pendingOffers = [
    { id: 1, customer: 'John Mukamuri', product: 'Personal Loan', amount: '$5,000', status: 'Pending' },
    { id: 2, customer: 'Sarah Chikwanha', product: 'Credit Card', limit: '$2,000', status: 'Approved' },
    { id: 3, customer: 'Michael Ndoro', product: 'Home Loan', amount: '$50,000', status: 'Under Review' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{bankName} Overview</h1>
        <p className="text-gray-600">Monitor and manage your bank's credit services on Scorly</p>
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
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Customer Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">Credit Score: {customer.creditScore}</p>
                    <p className="text-xs text-gray-500">{customer.lastActivity}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    customer.status === 'Excellent' 
                      ? 'bg-green-100 text-green-800' 
                      : customer.status === 'Good'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Offers */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Loan & Credit Offers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingOffers.map((offer) => (
                <div key={offer.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    offer.status === 'Approved' ? 'bg-green-500' :
                    offer.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        offer.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        offer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {offer.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">{offer.customer}</p>
                    <p className="text-sm text-gray-600">{offer.product}</p>
                    <p className="text-xs text-gray-500">
                      {offer.amount || offer.limit}
                    </p>
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

export default BankOverview;
