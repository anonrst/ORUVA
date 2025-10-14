'use client';

import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'default';
  } | null>(null);

  const [formData, setFormData] = useState({
    displayName: user?.email?.split('@')[0] || '',
    bio: 'Software developer passionate about blockchain technology.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'default' = 'default') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSave = () => {
    // In a real app, you'd save to your backend here
    setIsEditing(false);
    showNotification('Profile updated successfully!', 'success');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      displayName: user?.email?.split('@')[0] || '',
      bio: 'Software developer passionate about blockchain technology.',
      location: 'San Francisco, CA',
      website: 'https://example.com',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      {notification && (
        <Alert variant={notification.type}>
          {notification.message}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your avatar and display name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Display Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Enter display name"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100">{formData.displayName}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your account information and settings</CardDescription>
            </div>
            <div className="space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email Address
                </label>
                <p className="text-gray-900 dark:text-gray-100 mt-1">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  User ID
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-mono text-sm mt-1 break-all">
                  {user?.issuer?.slice(0, 20)}...
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                />
              ) : (
                <p className="text-gray-900 dark:text-gray-100 mt-1">{formData.bio}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Location
                </label>
                {isEditing ? (
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter your location"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 mt-1">{formData.location}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Website
                </label>
                {isEditing ? (
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="Enter your website URL"
                    className="mt-1"
                  />
                ) : (
                  <a 
                    href={formData.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 mt-1 block"
                  >
                    {formData.website}
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Information */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
          <CardDescription>Your blockchain wallet details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Public Address
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-gray-900 dark:text-gray-100 font-mono text-sm break-all flex-1">
                  {user?.publicAddress}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(user?.publicAddress || '');
                    showNotification('Address copied to clipboard!', 'success');
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}