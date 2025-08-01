
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DebtTracker = () => {
  const debts = [
    {
      name: "Chase Freedom Unlimited",
      type: "Credit Card",
      balance: 2340,
      minimum: 70,
      dueDate: "2024-02-15",
      apr: "22.99%",
      limit: 10000
    },
    {
      name: "Wells Fargo Auto Loan",
      type: "Auto Loan",
      balance: 18500,
      minimum: 425,
      dueDate: "2024-02-12",
      apr: "4.5%",
      limit: 25000
    },
    {
      name: "Discover Card",
      type: "Credit Card",
      balance: 892,
      minimum: 35,
      dueDate: "2024-02-20",
      apr: "19.99%",
      limit: 5000
    }
  ];

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalPayments = debts.reduce((sum, debt) => sum + debt.minimum, 0);

  const payoffStrategies = [
    {
      name: "Debt Avalanche",
      description: "Pay minimums on all debts, extra on highest APR",
      timeToFree: "2.1 years",
      totalInterest: "$3,420",
      recommended: true
    },
    {
      name: "Debt Snowball",
      description: "Pay minimums on all debts, extra on smallest balance",
      timeToFree: "2.3 years",
      totalInterest: "$3,890",
      recommended: false
    },
    {
      name: "Debt Consolidation",
      description: "Combine debts into one lower-rate loan",
      timeToFree: "3.0 years",
      totalInterest: "$2,150",
      recommended: false
    }
  ];

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUtilization = (balance: number, limit: number) => {
    return Math.round((balance / limit) * 100);
  };

  const getUrgencyBadge = (days: number) => {
    if (days <= 3) return <Badge className="bg-red-100 text-red-800">Due Soon</Badge>;
    if (days <= 7) return <Badge className="bg-yellow-100 text-yellow-800">Due This Week</Badge>;
    return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Debt Tracker</h2>
        <Button variant="outline">
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">${totalDebt.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Debt</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">${totalPayments}</div>
              <p className="text-sm text-gray-600">Monthly Payments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">23%</div>
              <p className="text-sm text-gray-600">Avg. Utilization</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.1</div>
              <p className="text-sm text-gray-600">Years to Payoff</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Debts</CardTitle>
            <CardDescription>Your active debt accounts and payment schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {debts.map((debt, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{debt.name}</h4>
                        {getUrgencyBadge(getDaysUntilDue(debt.dueDate))}
                      </div>
                      <p className="text-sm text-gray-600">{debt.type} • APR: {debt.apr}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Pay Now
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">Balance:</span> ${debt.balance.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-600">Minimum:</span> ${debt.minimum}
                    </div>
                    <div>
                      <span className="text-gray-600">Due:</span> {debt.dueDate}
                    </div>
                    <div>
                      <span className="text-gray-600">Days:</span> {getDaysUntilDue(debt.dueDate)} days
                    </div>
                  </div>

                  {debt.type === "Credit Card" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilization</span>
                        <span>{getUtilization(debt.balance, debt.limit)}%</span>
                      </div>
                      <Progress value={getUtilization(debt.balance, debt.limit)} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payoff Strategies</CardTitle>
            <CardDescription>Compare different approaches to eliminate debt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payoffStrategies.map((strategy, index) => (
                <div key={index} className={`border rounded-lg p-4 ${strategy.recommended ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                    {strategy.recommended && (
                      <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Time to Freedom:</span>
                      <div className="font-semibold">{strategy.timeToFree}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Interest:</span>
                      <div className="font-semibold">{strategy.totalInterest}</div>
                    </div>
                  </div>
                  <Button 
                    variant={strategy.recommended ? "default" : "outline"} 
                    size="sm" 
                    className="mt-3 w-full"
                  >
                    {strategy.recommended ? "Get Started" : "Learn More"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebtTracker;
