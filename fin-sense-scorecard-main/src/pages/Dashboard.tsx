
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CreditScoreOverview from "@/components/CreditScoreOverview";
import CreditReportSnapshot from "@/components/CreditReportSnapshot";
import RealTimeAlerts from "@/components/RealTimeAlerts";
import CreditImprovementInsights from "@/components/CreditImprovementInsights";
import ScoreSimulator from "@/components/ScoreSimulator";
import ProductRecommendations from "@/components/ProductRecommendations";
import DebtTracker from "@/components/DebtTracker";
import LinkedAccounts from "@/components/LinkedAccounts";
import BureauComparison from "@/components/BureauComparison";
import IdentityProtection from "@/components/IdentityProtection";
import Settings from "@/components/Settings";
import LearnCenter from "@/components/LearnCenter";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = () => {
    onLogout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <CreditScoreOverview />;
      case "report":
        return <CreditReportSnapshot />;
      case "alerts":
        return <RealTimeAlerts />;
      case "insights":
        return <CreditImprovementInsights />;
      case "simulator":
        return <ScoreSimulator />;
      case "recommendations":
        return <ProductRecommendations />;
      case "debt":
        return <DebtTracker />;
      case "accounts":
        return <LinkedAccounts />;
      case "bureaus":
        return <BureauComparison />;
      case "protection":
        return <IdentityProtection />;
      case "settings":
        return <Settings />;
      case "learn":
        return <LearnCenter />;
      default:
        return <CreditScoreOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
