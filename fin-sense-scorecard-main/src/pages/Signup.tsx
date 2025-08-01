import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bank: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();

  const zimbabweBanks = [
    "CBZ Bank Ltd",
    "Stanbic Bank Zimbabwe",
    "Standard Chartered Bank Zimbabwe",
    "Barclays Bank of Zimbabwe",
    "CABS",
    "Ecobank Zimbabwe",
    "FBC Bank",
    "NMB Bank",
    "Steward Bank",
    "ZB Bank",
    "Agribank",
    "BancABC",
    "First Capital Bank",
    "Nedbank Zimbabwe",
    "People's Own Savings Bank"
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setIsLoading(false);
        return;
      }

      // Validate password strength
      if (formData.password.length < 6) {
        setIsLoading(false);
        return;
      }

      // Check if regular user needs to select a bank
      const isRegularUser = !formData.email.toLowerCase().endsWith('@scorly.io') && 
                           !formData.email.toLowerCase().endsWith('.co.zw');
      
      if (isRegularUser && !formData.bank) {
        setIsLoading(false);
        return;
      }

      await signUp(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName, 
        formData.bank
      );
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isRegularUser = !formData.email.toLowerCase().endsWith('@scorly.io') && 
                       !formData.email.toLowerCase().endsWith('.co.zw');

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-navy-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join Scorly to track your credit score
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="h-11"
                  required
                />
                {formData.email && (
                  <p className="text-xs text-gray-500">
                    {formData.email.toLowerCase().endsWith('@scorly.io') && "System Administrator Account"}
                    {formData.email.toLowerCase().endsWith('.co.zw') && "Bank Administrator Account"}
                    {isRegularUser && "Regular User Account"}
                  </p>
                )}
              </div>

              {isRegularUser && (
                <div className="space-y-2">
                  <Label htmlFor="bank" className="text-sm font-medium text-gray-700">
                    Select Your Bank
                  </Label>
                  <Select value={formData.bank} onValueChange={(value) => handleChange("bank", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {zimbabweBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.password && formData.password.length < 6 && (
                  <p className="text-xs text-red-500">Password must be at least 6 characters</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-navy hover:bg-navy-dark text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-navy hover:text-navy-dark font-medium">
                  Sign in here
                </Link>
              </p>
              
              <p className="text-sm text-gray-600">
                <Link to="/" className="text-navy hover:text-navy-dark font-medium">
                  ← Back to Home
                </Link>
              </p>
            </div>
            
            {/* Account Type Information */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Account Types:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>@scorly.io:</strong> System Administrator</p>
                <p><strong>@bankname.co.zw:</strong> Bank Administrator</p>
                <p><strong>Other emails:</strong> Regular User (select your bank)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;