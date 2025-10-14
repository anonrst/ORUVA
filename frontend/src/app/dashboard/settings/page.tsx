'use client';

import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function SettingsPage() {
  const { logout, magic } = useAuth();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'default';
  } | null>(null);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    twoFactorAuth: false,
    darkMode: false,
  });

  const handleRevealPrivateKey = async () => {
    try {
      if (magic) {
        await magic.user.revealEVMPrivateKey();
      } else {
        showNotification('Magic SDK not initialized', 'error');
      }
    } catch (error: any) {
      // Check if the error is due to user cancellation
      if (error?.code === -32603 && error?.message?.includes('User canceled action')) {
        // User canceled the action, this is expected behavior - do nothing
        return;
      }

      // Handle other actual errors
      console.error('Error revealing private key:', error);
      showNotification('Failed to reveal private key. Please try again.', 'error');
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'default' = 'default') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showNotification('Settings updated successfully!', 'success');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, you'd call your API to delete the account
      showNotification('Account deletion initiated. You will receive a confirmation email.', 'warning');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showNotification('Error during logout. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account preferences and security settings.
        </p>
      </div>

      {notification && (
        <Alert variant={notification.type}>
          {notification.message}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Push Notifications
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive push notifications in your browser
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Marketing Emails
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive emails about new features and updates
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('marketingEmails')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.marketingEmails ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('twoFactorAuth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => showNotification('Password change email sent!', 'success')}
              >
                Change Password
              </Button>
            </div>

            <div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => showNotification('All devices logged out successfully!', 'success')}
              >
                Log Out All Devices
              </Button>
            </div>

            <div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRevealPrivateKey}
              >
                Show Private Key
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Dark Mode
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Switch to dark theme
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('darkMode')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => showNotification('Data export initiated. You will receive an email when ready.', 'success')}
              >
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              Sign Out
            </Button>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}