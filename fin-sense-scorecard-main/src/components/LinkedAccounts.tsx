
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LinkedAccounts = () => {
  const accounts = [
    {
      name: "Chase Checking",
      type: "Checking Account",
      bank: "Chase Bank",
      balance: "$3,240",
      status: "Connected",
      lastSync: "2 hours ago"
    },
    {
      name: "Wells Fargo Savings",
      type: "Savings Account",
      bank: "Wells Fargo",
      balance: "$12,500",
      status: "Connected",
      lastSync: "1 day ago"
    },
    {
      name: "Chase Freedom Unlimited",
      type: "Credit Card",
      bank: "Chase Bank",
      balance: "$2,340",
      status: "Connected",
      lastSync: "3 hours ago"
    },
    {
      name: "Discover Card",
      type: "Credit Card",
      bank: "Discover",
      balance: "$892",
      status: "Connected",
      lastSync: "5 hours ago"
    },
    {
      name: "Wells Fargo Auto Loan",
      type: "Auto Loan",
      bank: "Wells Fargo",
      balance: "$18,500",
      status: "Connected",
      lastSync: "1 day ago"
    }
  ];

  const supportedBanks = [
    { name: "Bank of America", supported: true },
    { name: "Capital One", supported: true },
    { name: "Citi", supported: true },
    { name: "American Express", supported: true },
    { name: "US Bank", supported: true },
    { name: "TD Bank", supported: true },
    { name: "PNC Bank", supported: true },
    { name: "Ally Bank", supported: true }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case "Error":
        return <Badge className="bg-red-100 text-red-800">Connection Error</Badge>;
      case "Syncing":
        return <Badge className="bg-yellow-100 text-yellow-800">Syncing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "Checking Account":
        return "🏦";
      case "Savings Account":
        return "💰";
      case "Credit Card":
        return "💳";
      case "Auto Loan":
        return "🚗";
      case "Mortgage":
        return "🏠";
      default:
        return "📊";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Linked Accounts</h2>
        <Button className="bg-navy hover:bg-navy-dark">
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">5</div>
              <p className="text-sm text-gray-600">Connected Accounts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <p className="text-sm text-gray-600">Banks Connected</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <p className="text-sm text-gray-600">Credit Cards</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <p className="text-sm text-gray-600">Loans</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Linked Accounts</CardTitle>
            <CardDescription>Manage your connected financial accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getAccountIcon(account.type)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{account.name}</h4>
                        <p className="text-sm text-gray-600">{account.bank} • {account.type}</p>
                        <p className="text-xs text-gray-500">Last sync: {account.lastSync}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 mb-1">{account.balance}</div>
                      {getStatusBadge(account.status)}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button variant="outline" size="sm">
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      Settings
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supported Banks</CardTitle>
            <CardDescription>Add accounts from these financial institutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {supportedBanks.map((bank, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium text-gray-900">{bank.name}</span>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Bank not listed?</h4>
              <p className="text-sm text-blue-800 mb-3">
                We support over 12,000 banks and credit unions. Search for yours when adding an account.
              </p>
              <Button variant="outline" size="sm">
                View All Supported Banks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Your account information is protected with bank-level security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold text-gray-900 mb-1">256-bit Encryption</h4>
              <p className="text-sm text-gray-600">All data is encrypted in transit and at rest</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🛡️</div>
              <h4 className="font-semibold text-gray-900 mb-1">Read-Only Access</h4>
              <p className="text-sm text-gray-600">We can only view your data, never make changes</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🏢</div>
              <h4 className="font-semibold text-gray-900 mb-1">SOC 2 Compliant</h4>
              <p className="text-sm text-gray-600">Independently audited security controls</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedAccounts;
