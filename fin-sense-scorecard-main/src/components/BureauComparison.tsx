
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BureauComparison = () => {
  const bureauData = [
    {
      name: "Experian",
      score: 742,
      range: "Good",
      lastUpdated: "2 days ago",
      model: "FICO 8",
      accounts: 8,
      inquiries: 2,
      negativeItems: 0
    },
    {
      name: "Equifax",
      score: 738,
      range: "Good",
      lastUpdated: "1 week ago",
      model: "FICO 8",
      accounts: 8,
      inquiries: 2,
      negativeItems: 0
    },
    {
      name: "TransUnion",
      score: 745,
      range: "Good",
      lastUpdated: "3 days ago",
      model: "FICO 8",
      accounts: 7,
      inquiries: 1,
      negativeItems: 0
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 700) return "text-blue-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreProgress = (score: number) => {
    return ((score - 300) / 550) * 100;
  };

  const getRangeBadge = (range: string) => {
    switch (range) {
      case "Excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case "Good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case "Fair":
        return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
      case "Poor":
        return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
      default:
        return <Badge variant="secondary">{range}</Badge>;
    }
  };

  const averageScore = Math.round(bureauData.reduce((sum, bureau) => sum + bureau.score, 0) / bureauData.length);
  const scoreVariance = Math.max(...bureauData.map(b => b.score)) - Math.min(...bureauData.map(b => b.score));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Bureau Comparison</h2>
        <Button variant="outline">
          Refresh All Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}</div>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">{scoreVariance}</div>
              <p className="text-sm text-gray-600">Point Variance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3/3</div>
              <p className="text-sm text-gray-600">Reports Available</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {bureauData.map((bureau, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{bureau.name}</CardTitle>
                {getRangeBadge(bureau.range)}
              </div>
              <CardDescription>Last updated: {bureau.lastUpdated}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(bureau.score)}`}>
                  {bureau.score}
                </div>
                <p className="text-sm text-gray-600 mt-1">{bureau.model}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score Range</span>
                  <span>{bureau.range}</span>
                </div>
                <Progress value={getScoreProgress(bureau.score)} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>300</span>
                  <span>850</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accounts:</span>
                  <span className="font-medium">{bureau.accounts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inquiries:</span>
                  <span className="font-medium">{bureau.inquiries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Negative Items:</span>
                  <span className="font-medium text-green-600">{bureau.negativeItems}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View Full Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why Scores Differ</CardTitle>
          <CardDescription>Understanding variations between credit bureaus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Common Reasons for Differences:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Creditors may not report to all three bureaus</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Reporting dates can vary between bureaus</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Different scoring models may be used</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Data entry errors or inconsistencies</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">What You Can Do:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Monitor all three reports regularly</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Dispute any errors you find</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Focus on the behaviors that improve all scores</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Contact creditors if information is missing</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BureauComparison;
