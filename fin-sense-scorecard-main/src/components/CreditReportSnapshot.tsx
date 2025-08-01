
import React, { useState } from 'react';
import { FaDownload, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const CreditReportSnapshot = () => {
  const [selectedTimeline, setSelectedTimeline] = useState<string>("");

  const handleDownloadReport = () => {
    if (!selectedTimeline) {
      toast({
        title: "Please select a timeline",
        description: "Choose a time period for your credit report download",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Downloading Credit Report",
      description: `Your ${selectedTimeline} credit report is being prepared for download`,
    });

    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your credit report has been downloaded successfully",
      });
    }, 2000);
  };

  const reportData = {
    totalAccounts: 12,
    openAccounts: 8,
    closedAccounts: 4,
    totalBalance: 125000,
    availableCredit: 85000,
    creditUtilization: 32,
    onTimePayments: 96
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credit Report Snapshot</h1>
          <p className="text-gray-600 mt-2">Comprehensive view of your credit profile</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select onValueChange={setSelectedTimeline}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="1-month">1 Month</SelectItem>
              <SelectItem value="3-months">3 Months</SelectItem>
              <SelectItem value="6-months">6 Months</SelectItem>
              <SelectItem value="12-months">12 Months</SelectItem>
              <SelectItem value="24-months">24 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleDownloadReport} className="bg-navy hover:bg-navy-dark">
            <FaDownload className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Credit Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{reportData.totalAccounts}</div>
            <div className="flex text-sm text-gray-500 mt-1">
              <span className="text-green-600">{reportData.openAccounts} Open</span>
              <span className="mx-2">•</span>
              <span className="text-gray-500">{reportData.closedAccounts} Closed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${reportData.totalBalance.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Available: ${reportData.availableCredit.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Credit Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{reportData.creditUtilization}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${reportData.creditUtilization}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">On-Time Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportData.onTimePayments}%</div>
            <div className="text-sm text-gray-500 mt-1">Excellent payment history</div>
          </CardContent>
        </Card>
      </div>

      {/* Download History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaFileAlt className="w-5 h-5 mr-2" />
            Recent Downloads
          </CardTitle>
          <CardDescription>
            Your recent credit report downloads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaCalendarAlt className="w-4 h-4 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">6 Month Credit Report</p>
                  <p className="text-sm text-gray-500">Downloaded on Jan 15, 2024</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <FaDownload className="w-4 h-4 mr-1" />
                Re-download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaCalendarAlt className="w-4 h-4 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">3 Month Credit Report</p>
                  <p className="text-sm text-gray-500">Downloaded on Dec 20, 2023</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <FaDownload className="w-4 h-4 mr-1" />
                Re-download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaCalendarAlt className="w-4 h-4 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">12 Month Credit Report</p>
                  <p className="text-sm text-gray-500">Downloaded on Nov 18, 2023</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <FaDownload className="w-4 h-4 mr-1" />
                Re-download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditReportSnapshot;
