
import React, { useState } from 'react';
import { FaSave, FaCog, FaDatabase, FaBell, FaShieldAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    systemName: 'Scorly Credit System',
    maxUsers: '50000',
    sessionTimeout: '30',
    enableNotifications: true,
    enableTwoFactor: true,
    autoBackup: true,
    maintenanceMode: false,
    apiRateLimit: '1000',
    maxLoginAttempts: '5',
    passwordExpiry: '90',
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Implement save logic here
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaCog className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) => handleSettingChange('systemName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxUsers">Maximum Users</Label>
              <Input
                id="maxUsers"
                type="number"
                value={settings.maxUsers}
                onChange={(e) => handleSettingChange('maxUsers', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaShieldAlt className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
              <Switch
                id="enableTwoFactor"
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('maxLoginAttempts', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
              <Input
                id="apiRateLimit"
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => handleSettingChange('apiRateLimit', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaBell className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableNotifications">Enable System Notifications</Label>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
              />
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <FaDatabase className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Database Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoBackup">Enable Auto Backup</Label>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} className="bg-navy hover:bg-navy-dark">
          <FaSave className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;
