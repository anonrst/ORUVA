'use client';

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      description: '+12% from last month',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Revenue',
      value: '$45,231',
      description: '+8% from last month',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Orders',
      value: '1,234',
      description: '+23% from last month',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      description: '+0.5% from last month',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Email Address
              </label>
              <p className="text-gray-900 dark:text-gray-100">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                User ID
              </label>
              <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                {user?.issuer}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Wallet Address
              </label>
              <p className="text-gray-900 dark:text-gray-100 font-mono text-sm break-all">
                {user?.publicAddress}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Successfully logged in
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Just now
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Profile updated
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    New device connected
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}