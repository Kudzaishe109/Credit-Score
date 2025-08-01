
import React, { useState } from 'react';
import { FaEye, FaUserPlus, FaSearch, FaEdit, FaCreditCard } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    { id: 1, name: 'John Mukamuri', email: 'john@gmail.com', creditScore: 720, status: 'Excellent', lastLogin: '2 hours ago', products: 2 },
    { id: 2, name: 'Sarah Chikwanha', email: 'sarah@yahoo.com', creditScore: 680, status: 'Good', lastLogin: '5 hours ago', products: 1 },
    { id: 3, name: 'Michael Ndoro', email: 'michael@gmail.com', creditScore: 620, status: 'Fair', lastLogin: '1 day ago', products: 3 },
    { id: 4, name: 'Grace Moyo', email: 'grace@outlook.com', creditScore: 750, status: 'Excellent', lastLogin: '2 days ago', products: 2 },
    { id: 5, name: 'David Chuma', email: 'david@gmail.com', creditScore: 590, status: 'Poor', lastLogin: '1 week ago', products: 0 },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
        <p className="text-gray-600">Manage and monitor your bank customers</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-navy hover:bg-navy-dark">
            <FaUserPlus className="w-4 h-4 mr-2" />
            Add New Customer
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.creditScore >= 700).length}
            </p>
            <p className="text-sm text-gray-600">Excellent Credit</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {customers.filter(c => c.creditScore >= 600 && c.creditScore < 700).length}
            </p>
            <p className="text-sm text-gray-600">Good Credit</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {customers.reduce((sum, c) => sum + c.products, 0)}
            </p>
            <p className="text-sm text-gray-600">Active Products</p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Customers ({filteredCustomers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getCreditScoreColor(customer.creditScore)}`}>
                      {customer.creditScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.products}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <FaEye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <FaEdit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-blue-600">
                        <FaCreditCard className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
