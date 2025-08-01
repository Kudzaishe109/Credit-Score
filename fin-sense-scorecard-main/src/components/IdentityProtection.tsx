
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const IdentityProtection = () => {
  const [darkWebMonitoring, setDarkWebMonitoring] = useState(true);
  const [creditFreezeStatus, setCreditFreezeStatus] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const securityAlerts = [
    {
      type: "warning",
      title: "Unusual Login Activity",
      description: "Login from new device detected from California",
      date: "2 hours ago",
      severity: "Medium"
    },
    {
      type: "info",
      title: "Dark Web Scan Complete",
      description: "No compromised accounts found in latest scan",
      date: "1 day ago",
      severity: "Low"
    },
    {
      type: "success",
      title: "Credit Freeze Activated",
      description: "All three credit bureaus have been frozen",
      date: "1 week ago",
      severity: "Good"
    }
  ];

  const protectionFeatures = [
    {
      name: "Credit Monitoring",
      description: "24/7 monitoring of your credit reports",
      status: "Active",
      icon: "📊"
    },
    {
      name: "Identity Alerts",
      description: "Real-time alerts for suspicious activity",
      status: "Active",
      icon: "🔔"
    },
    {
      name: "Dark Web Monitoring",
      description: "Scans for your personal information on dark web",
      status: "Active",
      icon: "🕵️"
    },
    {
      name: "Credit Freeze",
      description: "Prevent new accounts from being opened",
      status: "Inactive",
      icon: "🧊"
    },
    {
      name: "Identity Restoration",
      description: "Expert assistance if identity theft occurs",
      status: "Available",
      icon: "🛡️"
    }
  ];

  const getAlertBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case "Low":
        return <Badge className="bg-blue-100 text-blue-800">Low Risk</Badge>;
      case "Good":
        return <Badge className="bg-green-100 text-green-800">Good News</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "Inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      case "Available":
        return <Badge className="bg-blue-100 text-blue-800">Available</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Identity Protection</h2>
        <Button variant="outline">
          Protection Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">🛡️</div>
              <p className="text-sm text-gray-600 mt-2">Protection Active</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-sm text-gray-600">Active Monitors</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <p className="text-sm text-gray-600">Recent Alerts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <p className="text-sm text-gray-600">Threats Detected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Protection Features</CardTitle>
            <CardDescription>Manage your identity protection services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {protectionFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(feature.status)}
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Alerts</CardTitle>
            <CardDescription>Stay informed about your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityAlerts.map((alert, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        {getAlertBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{alert.description}</p>
                      <p className="text-xs text-gray-500">{alert.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your protection settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Dark Web Monitoring</h4>
                  <p className="text-sm text-gray-600">Scan for compromised data</p>
                </div>
                <Switch
                  checked={darkWebMonitoring}
                  onCheckedChange={setDarkWebMonitoring}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Credit Freeze</h4>
                  <p className="text-sm text-gray-600">Prevent new account openings</p>
                </div>
                <Switch
                  checked={creditFreezeStatus}
                  onCheckedChange={setCreditFreezeStatus}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Instant Alerts</h4>
                  <p className="text-sm text-gray-600">Real-time notifications</p>
                </div>
                <Switch
                  checked={alertsEnabled}
                  onCheckedChange={setAlertsEnabled}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full bg-navy hover:bg-navy-dark">
                Freeze All Credit Reports
              </Button>
              <Button variant="outline" className="w-full">
                Request Credit Report
              </Button>
              <Button variant="outline" className="w-full">
                File Fraud Alert
              </Button>
              <Button variant="outline" className="w-full">
                Contact Identity Specialist
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identity Theft Resources</CardTitle>
          <CardDescription>Know what to do if your identity is stolen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">📞</div>
              <h4 className="font-semibold text-gray-900 mb-1">Report Fraud</h4>
              <p className="text-sm text-gray-600 mb-3">Contact creditors and file reports</p>
              <Button variant="outline" size="sm">
                Get Help
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">📋</div>
              <h4 className="font-semibold text-gray-900 mb-1">Document Everything</h4>
              <p className="text-sm text-gray-600 mb-3">Keep records of all communications</p>
              <Button variant="outline" size="sm">
                Learn How
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">🔧</div>
              <h4 className="font-semibold text-gray-900 mb-1">Restore Your Credit</h4>
              <p className="text-sm text-gray-600 mb-3">Steps to repair your credit</p>
              <Button variant="outline" size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdentityProtection;
