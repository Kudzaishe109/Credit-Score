
import React from 'react';
import { FaArrowUp, FaArrowDown, FaInfoCircle } from 'react-icons/fa';

const CreditScoreOverview = () => {
  const creditScore = 720;
  const previousScore = 695;
  const scoreChange = creditScore - previousScore;
  const scoreRange = creditScore >= 800 ? 'Excellent' : creditScore >= 740 ? 'Very Good' : creditScore >= 670 ? 'Good' : creditScore >= 580 ? 'Fair' : 'Poor';
  const rangeColor = creditScore >= 800 ? 'score-excellent' : creditScore >= 740 ? 'score-good' : creditScore >= 670 ? 'score-good' : creditScore >= 580 ? 'score-fair' : 'score-poor';

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Credit Score</h2>
        <FaInfoCircle className="w-5 h-5 text-gray-400 cursor-help" title="Updated daily from all three bureaus" />
      </div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <div className="w-48 h-48 rounded-full credit-score-circle flex items-center justify-center">
            <div className="w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
              <div className="text-5xl font-bold text-gray-900">{creditScore}</div>
              <div className={`text-lg font-semibold ${rangeColor}`}>{scoreRange}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            {scoreChange >= 0 ? (
              <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <FaArrowDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`font-semibold ${scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(scoreChange)} points
            </span>
          </div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">3/3</div>
          <div className="text-sm text-gray-600">Bureaus Updated</div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">2 hours ago</div>
          <div className="text-sm text-gray-600">Last Refresh</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Score Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Payment History (35%)</span>
            <span className="text-green-600 font-medium">Excellent</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Credit Utilization (30%)</span>
            <span className="text-yellow-600 font-medium">Good</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Length of History (15%)</span>
            <span className="text-green-600 font-medium">Very Good</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Credit Mix (10%)</span>
            <span className="text-green-600 font-medium">Good</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">New Credit (10%)</span>
            <span className="text-yellow-600 font-medium">Fair</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreOverview;
