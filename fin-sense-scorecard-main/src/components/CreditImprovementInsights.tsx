
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CreditImprovementInsights = () => {
  const tips = [
    {
      priority: "high",
      title: "Reduce Credit Card Utilization",
      description: "Pay down your Chase Freedom card balance to below 30% utilization",
      impact: "Could increase score by 15-25 points",
      action: "Pay $340 to reach 20% utilization",
      timeline: "1-2 months"
    },
    {
      priority: "medium",
      title: "Diversify Credit Mix",
      description: "Consider adding an installment loan to improve your credit mix",
      impact: "Could increase score by 5-10 points",
      action: "Explore personal loan options",
      timeline: "3-6 months"
    },
    {
      priority: "low",
      title: "Keep Old Accounts Open",
      description: "Don't close your oldest credit card to maintain credit history length",
      impact: "Prevents score decrease of 10-20 points",
      action: "Keep Discover card active",
      timeline: "Ongoing"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
      default:
        return <Badge variant="secondary">Priority</Badge>;
    }
  };

  const goalProgress = 85; // Current progress towards goal

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Credit Improvement Insights</h2>
        <Button variant="outline">
          Get Personalized Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Improvement Recommendations</CardTitle>
            <CardDescription>Personalized tips to boost your credit score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {tips.map((tip, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                      {getPriorityBadge(tip.priority)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>💪 {tip.impact}</span>
                      <span>⏰ {tip.timeline}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-navy">{tip.action}</span>
                  <Button variant="outline" size="sm">
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Goal</CardTitle>
              <CardDescription>Your progress toward 780</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-navy">742 → 780</div>
                  <p className="text-sm text-gray-600">38 points to go</p>
                </div>
                <Progress value={goalProgress} className="h-3" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">{goalProgress}% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Month's Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">Made all payments on time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">⚠</span>
                  <span className="text-sm">Reduce credit utilization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">○</span>
                  <span className="text-sm">Review credit report</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left">
                  📖 Understanding Credit Utilization
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  📊 How Credit Scores Work
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  💡 Building Credit History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreditImprovementInsights;
