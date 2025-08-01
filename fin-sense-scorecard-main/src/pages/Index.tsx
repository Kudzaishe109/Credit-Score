
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login/dashboard logic is handled in App.tsx
    // This component shouldn't be reached in normal flow
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">CreditScore Pro</h1>
        <p className="text-xl text-muted-foreground">Loading your credit dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
