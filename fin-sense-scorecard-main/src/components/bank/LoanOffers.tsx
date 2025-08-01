
import React, { useState } from 'react';
import { FaHandshake, FaPlus, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { Button } from "@/components/ui/button";

const LoanOffers = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const offers = [
    { id: 1, customer: 'John Mukamuri', product: 'Personal Loan', amount: '$5,000', rate: '12%', term: '24 months', status: 'Pending', appliedDate: '2024-01-15' },
    { id: 2, customer: 'Sarah Chikwanha', product: 'Credit Card', limit: '$2,000', rate: '18%', term: 'Revolving', status: 'Approved', appliedDate: '2024-01-14' },
    { id: 3, customer: 'Michael Ndoro', product: 'Home Loan', amount: '$50,000', rate: '8%', term: '15 years', status: 'Under Review', appliedDate: '2024-01-13' },
    { id: 4, customer: 'Grace Moyo', product: 'Auto Loan', amount: '$15,000', rate: '10%', term: '5 years', status: 'Approved', appliedDate: '2024-01-12' },
    { id: 5, customer: 'David Chuma', product: 'Business Loan', amount: '$25,000', rate: '14%', term: '3 years', status: 'Rejected', appliedDate: '2024-01-10' },
  ];

  const filteredOffers = filterStatus === 'all' ? offers : offers.filter(offer => offer.status.toLowerCase().replace(' ', '-') === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan & Credit Offers</h1>
        <p className="text-gray-600">Manage loan applications and credit offers</p>
      </div>

      {/* Offer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaHandshake className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {offers.filter(o => o.status === 'Pending').length}
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
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {offers.filter(o => o.status === 'Approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaEye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {offers.filter(o => o.status === 'Under Review').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimes className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {offers.filter(o => o.status === 'Rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'under-review', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? "bg-navy hover:bg-navy-dark" : ""}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </Button>
            ))}
          </div>
          <Button className="bg-navy hover:bg-navy-dark">
            <FaPlus className="w-4 h-4 mr-2" />
            Create New Offer
          </Button>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Offers ({filteredOffers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount/Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.amount || offer.limit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.term}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.appliedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <FaEye className="w-4 h-4" />
                      </Button>
                      {offer.status === 'Pending' && (
                        <>
                          <Button size="sm" variant="ghost" className="text-green-600">
                            <FaCheck className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <FaTimes className="w-4 h-4" />
                          </Button>
                        </>
                      )}
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

export default LoanOffers;
