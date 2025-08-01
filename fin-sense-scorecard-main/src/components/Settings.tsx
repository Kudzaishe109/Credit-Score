
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567"
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    marketingEmails: false,
    scoreChanges: true,
    paymentReminders: true,
    fraudAlerts: true
  });

  const [preferences, setPreferences] = useState({
    scoreGoal: "780",
    alertFrequency: "immediate",
    reportPreference: "monthly",
    theme: "light"
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    biometricLogin: true,
    loginAlerts: true
  });

  const handleProfileUpdate = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationToggle = (setting: string) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSecurityToggle = (setting: string) => {
    setSecurity(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <Button variant="outline">
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleProfileUpdate("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleProfileUpdate("lastName", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileUpdate("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleProfileUpdate("phone", e.target.value)}
              />
            </div>
            <Button className="w-full bg-navy hover:bg-navy-dark">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailAlerts">Email Alerts</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                id="emailAlerts"
                checked={notifications.emailAlerts}
                onCheckedChange={() => handleNotificationToggle("emailAlerts")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsAlerts">SMS Alerts</Label>
                <p className="text-sm text-gray-600">Receive text message notifications</p>
              </div>
              <Switch
                id="smsAlerts"
                checked={notifications.smsAlerts}
                onCheckedChange={() => handleNotificationToggle("smsAlerts")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive app notifications</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={notifications.pushNotifications}
                onCheckedChange={() => handleNotificationToggle("pushNotifications")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="scoreChanges">Score Changes</Label>
                <p className="text-sm text-gray-600">Alert when credit score changes</p>
              </div>
              <Switch
                id="scoreChanges"
                checked={notifications.scoreChanges}
                onCheckedChange={() => handleNotificationToggle("scoreChanges")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="fraudAlerts">Fraud Alerts</Label>
                <p className="text-sm text-gray-600">Suspicious activity notifications</p>
              </div>
              <Switch
                id="fraudAlerts"
                checked={notifications.fraudAlerts}
                onCheckedChange={() => handleNotificationToggle("fraudAlerts")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scoreGoal">Credit Score Goal</Label>
              <Select value={preferences.scoreGoal} onValueChange={(value) => setPreferences(prev => ({ ...prev, scoreGoal: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="700">700 - Good</SelectItem>
                  <SelectItem value="750">750 - Very Good</SelectItem>
                  <SelectItem value="780">780 - Excellent</SelectItem>
                  <SelectItem value="800">800+ - Exceptional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertFrequency">Alert Frequency</Label>
              <Select value={preferences.alertFrequency} onValueChange={(value) => setPreferences(prev => ({ ...prev, alertFrequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportPreference">Report Updates</Label>
              <Select value={preferences.reportPreference} onValueChange={(value) => setPreferences(prev => ({ ...prev, reportPreference: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={security.twoFactorAuth}
                onCheckedChange={() => handleSecurityToggle("twoFactorAuth")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="biometricLogin">Biometric Login</Label>
                <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
              </div>
              <Switch
                id="biometricLogin"
                checked={security.biometricLogin}
                onCheckedChange={() => handleSecurityToggle("biometricLogin")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="loginAlerts">Login Alerts</Label>
                <p className="text-sm text-gray-600">Notify me of new logins</p>
              </div>
              <Switch
                id="loginAlerts"
                checked={security.loginAlerts}
                onCheckedChange={() => handleSecurityToggle("loginAlerts")}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Manage Devices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account and data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="w-full">
              Download My Data
            </Button>
            <Button variant="outline" className="w-full">
              Privacy Settings
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
