
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BankAdminDashboard from "./pages/BankAdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

// App routes component that uses auth context
function AppRoutes() {
  const { user, loading, isAdmin, isBankAdmin, userBank, signOut } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  const isAuthenticated = !!user;

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : isBankAdmin ? (
              <Navigate to="/bank" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Landing onGetStarted={() => window.location.href = '/login'} />
          )
        } 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : isBankAdmin ? (
              <Navigate to="/bank" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Login />
          )
        } 
      />
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? (
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : isBankAdmin ? (
              <Navigate to="/bank" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Signup />
          )
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated && !isAdmin && !isBankAdmin ? (
            <Dashboard onLogout={signOut} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/admin" 
        element={
          isAuthenticated && isAdmin ? (
            <AdminDashboard onLogout={signOut} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/bank" 
        element={
          isAuthenticated && isBankAdmin ? (
            <BankAdminDashboard 
              onLogout={signOut} 
              bankName={userBank}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="scorly-app font-roboto">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
