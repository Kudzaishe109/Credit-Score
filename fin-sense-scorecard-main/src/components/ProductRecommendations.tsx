
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProductRecommendations = () => {
  const creditCards = [
    {
      name: "Chase Sapphire Preferred",
      type: "Travel Rewards",
      apr: "18.99% - 25.99%",
      bonus: "60,000 points",
      fee: "$95 annual fee",
      approvalOdds: "Excellent",
      benefits: ["2x points on travel", "Transfer partners", "Trip protection"]
    },
    {
      name: "Capital One Venture X",
      type: "Premium Travel",
      apr: "19.99% - 26.99%",
      bonus: "75,000 miles",
      fee: "$395 annual fee",
      approvalOdds: "Good",
      benefits: ["2x miles on everything", "Airport lounge access", "$300 travel credit"]
    },
    {
      name: "Citi Double Cash",
      type: "Cash Back",
      apr: "16.99% - 26.99%",
      bonus: "$200 cash back",
      fee: "No annual fee",
      approvalOdds: "Excellent",
      benefits: ["2% cash back", "No category restrictions", "Balance transfers"]
    }
  ];

  const loans = [
    {
      name: "SoFi Personal Loan",
      type: "Personal Loan",
      rate: "5.99% - 21.28%",
      amount: "$5,000 - $100,000",
      term: "2-7 years",
      approvalOdds: "Good",
      benefits: ["No fees", "Rate discount with autopay", "Unemployment protection"]
    },
    {
      name: "Marcus by Goldman Sachs",
      type: "Personal Loan",
      rate: "6.99% - 19.99%",
      amount: "$3,500 - $40,000",
      term: "3-6 years",
      approvalOdds: "Excellent",
      benefits: ["No fees", "Flexible payment date", "Rate discount available"]
    }
  ];

  const getApprovalBadge = (odds: string) => {
    switch (odds) {
      case "Excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent Match</Badge>;
      case "Good":
        return <Badge className="bg-blue-100 text-blue-800">Good Match</Badge>;
      case "Fair":
        return <Badge className="bg-yellow-100 text-yellow-800">Fair Match</Badge>;
      default:
        return <Badge variant="secondary">Check Odds</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Product Recommendations</h2>
        <Button variant="outline">
          Update Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <p className="text-sm text-gray-600">Pre-qualified Cards</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-sm text-gray-600">Loan Options</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">85%</div>
              <p className="text-sm text-gray-600">Avg. Approval Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Credit Cards</CardTitle>
            <CardDescription>Based on your credit profile and spending habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {creditCards.map((card, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{card.name}</h4>
                        {getApprovalBadge(card.approvalOdds)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{card.type}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">APR:</span> {card.apr}
                        </div>
                        <div>
                          <span className="text-gray-600">Bonus:</span> {card.bonus}
                        </div>
                        <div>
                          <span className="text-gray-600">Fee:</span> {card.fee}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      <Button size="sm" className="bg-navy hover:bg-navy-dark">
                        Apply
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.benefits.map((benefit, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Loan Options</CardTitle>
            <CardDescription>Consolidate debt or fund major purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loans.map((loan, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{loan.name}</h4>
                        {getApprovalBadge(loan.approvalOdds)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{loan.type}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Rate:</span> {loan.rate}
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span> {loan.amount}
                        </div>
                        <div>
                          <span className="text-gray-600">Term:</span> {loan.term}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      <Button size="sm" className="bg-navy hover:bg-navy-dark">
                        Apply
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {loan.benefits.map((benefit, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductRecommendations;
