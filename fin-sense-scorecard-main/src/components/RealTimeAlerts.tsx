
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RealTimeAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Credit Utilization Increase",
      message: "Your credit utilization has increased to 28% on your Chase Freedom card.",
      date: "2 hours ago",
      action: "View Details"
    },
    {
      id: 2,
      type: "info",
      title: "Payment Reminder",
      message: "Your Wells Fargo Auto Loan payment of $425 is due in 3 days.",
      date: "1 day ago",
      action: "Schedule Payment"
    },
    {
      id: 3,
      type: "success",
      title: "Score Improvement",
      message: "Your credit score increased by 5 points to 742!",
      date: "3 days ago",
      action: "View Report"
    },
    {
      id: 4,
      type: "danger",
      title: "Suspicious Activity",
      message: "A hard inquiry was made by an unknown creditor. Please review.",
      date: "1 week ago",
      action: "Dispute"
    }
  ];

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "danger":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "success":
        return <Badge className="bg-green-100 text-green-800">Good News</Badge>;
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge variant="secondary">Alert</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return "🚨";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      default:
        return "🔔";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Real-Time Alerts</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-sm text-gray-600">Warnings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-sm text-gray-600">Informational</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">10</div>
              <p className="text-sm text-gray-600">Total This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Stay informed about changes to your credit profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        {getAlertBadge(alert.type)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.date}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {alert.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAlerts;
