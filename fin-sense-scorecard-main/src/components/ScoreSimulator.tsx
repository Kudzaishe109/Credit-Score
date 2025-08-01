
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ScoreSimulator = () => {
  const [scenario, setScenario] = useState("");
  const [amount, setAmount] = useState("");
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);
  const currentScore = 742;

  const scenarios = [
    { value: "pay_balance", label: "Pay off credit card balance" },
    { value: "increase_utilization", label: "Increase credit utilization" },
    { value: "miss_payment", label: "Miss a payment" },
    { value: "open_account", label: "Open new credit account" },
    { value: "close_account", label: "Close credit account" },
    { value: "pay_loan", label: "Pay off loan early" }
  ];

  const handleSimulate = () => {
    if (!scenario || !amount) return;

    let scoreChange = 0;
    const amountNum = parseInt(amount);

    switch (scenario) {
      case "pay_balance":
        scoreChange = Math.min(Math.floor(amountNum / 100) * 2, 25);
        break;
      case "increase_utilization":
        scoreChange = -Math.min(Math.floor(amountNum / 100) * 3, 30);
        break;
      case "miss_payment":
        scoreChange = -Math.min(amountNum, 100);
        break;
      case "open_account":
        scoreChange = -Math.min(Math.floor(amountNum / 1000) * 5, 15);
        break;
      case "close_account":
        scoreChange = -Math.min(Math.floor(amountNum / 1000) * 3, 20);
        break;
      case "pay_loan":
        scoreChange = Math.min(Math.floor(amountNum / 1000) * 2, 15);
        break;
    }

    setSimulatedScore(Math.max(300, Math.min(850, currentScore + scoreChange)));
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 700) return "text-blue-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreChange = () => {
    if (simulatedScore === null) return null;
    const change = simulatedScore - currentScore;
    const color = change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600";
    const sign = change > 0 ? "+" : "";
    return { change, color, sign };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Credit Score Simulator</h2>
        <Button variant="outline" onClick={() => setSimulatedScore(null)}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What-If Scenarios</CardTitle>
            <CardDescription>See how different actions might affect your credit score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">Choose a scenario</Label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a scenario to simulate" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleSimulate} 
              className="w-full bg-navy hover:bg-navy-dark"
              disabled={!scenario || !amount}
            >
              Simulate Impact
            </Button>

            <div className="text-xs text-gray-500 mt-4">
              <p>* Simulations are estimates and actual results may vary based on many factors.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>Projected impact on your credit score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
                  {currentScore}
                </div>
              </div>

              {simulatedScore !== null && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Projected Score</h3>
                    <div className={`text-4xl font-bold ${getScoreColor(simulatedScore)}`}>
                      {simulatedScore}
                    </div>
                    {getScoreChange() && (
                      <div className={`text-lg font-semibold mt-2 ${getScoreChange()!.color}`}>
                        {getScoreChange()!.sign}{getScoreChange()!.change} points
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Impact Analysis</h4>
                    <p className="text-sm text-gray-600">
                      {getScoreChange()!.change > 0 && "This action could help improve your credit score. "}
                      {getScoreChange()!.change < 0 && "This action could negatively impact your credit score. "}
                      {getScoreChange()!.change === 0 && "This action is likely to have minimal impact on your credit score. "}
                      Results typically appear on your credit report within 1-2 billing cycles.
                    </p>
                  </div>
                </>
              )}

              {simulatedScore === null && (
                <div className="text-gray-500 py-8">
                  <p>Select a scenario and enter an amount to see the projected impact on your credit score.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Scenarios</CardTitle>
          <CardDescription>Quick simulations for common credit actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Pay off $1,000 balance</h4>
              <p className="text-sm text-gray-600 mb-3">Reduce credit utilization</p>
              <div className="text-lg font-semibold text-green-600">+15-20 points</div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Open new credit card</h4>
              <p className="text-sm text-gray-600 mb-3">Hard inquiry + new account</p>
              <div className="text-lg font-semibold text-red-600">-5-10 points</div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Miss one payment</h4>
              <p className="text-sm text-gray-600 mb-3">30+ days late</p>
              <div className="text-lg font-semibold text-red-600">-60-110 points</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreSimulator;
