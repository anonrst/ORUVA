import { useBankingData } from '../hooks/useBankingData';
import { useAccount } from 'wagmi';

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const {
    collateralInVault,
    daiDebt,
    collateralBalance,
    stablecoinBalance,
    collateralizationRatio,
    isLoading
  } = useBankingData();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-400">
          Connect your wallet to access the banking system
        </h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading your banking data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Banking Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Manage your collateral and stablecoin positions</p>
      </div>

      {/* Account Info */}
      <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-gray-700/50 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-lg">👤</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Connected Account</h3>
            <p className="font-mono text-sm text-white bg-gray-700/50 px-3 py-1 rounded-xl">{address}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          title="Collateral in Vault"
          value={`${parseFloat(collateralInVault).toFixed(4)} ETH`}
          subtitle="Locked as collateral"
          color="blue"
        />
        <StatCard
          title="Borrowed Amount"
          value={`${parseFloat(daiDebt).toFixed(2)} BANK`}
          subtitle="Outstanding debt"
          color="red"
        />
        <StatCard
          title="Wallet Balance"
          value={`${parseFloat(collateralBalance).toFixed(4)} ETH`}
          subtitle="Available to deposit"
          color="green"
        />
        <StatCard
          title="Stablecoin Balance"
          value={`${parseFloat(stablecoinBalance).toFixed(2)} BANK`}
          subtitle="In your wallet"
          color="purple"
        />
      </div>

      {/* Collateralization Ratio */}
      <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mb-8 shadow-2xl">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-white text-lg">💚</span>
          </div>
          <h3 className="text-xl font-bold text-white">Position Health</h3>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Collateralization Ratio</p>
            <p className="text-3xl font-bold text-white">{collateralizationRatio}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-2">Status</p>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${getHealthDotColor(collateralizationRatio)}`}></div>
              <p className={`text-lg font-semibold ${getHealthColor(collateralizationRatio)}`}>
                {getHealthStatus(collateralizationRatio)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-2xl h-3 overflow-hidden">
          <div
            className={`h-3 rounded-2xl transition-all duration-500 ${getHealthBarColor(collateralizationRatio)}`}
            style={{ width: `${Math.min(parseFloat(collateralizationRatio) || 0, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'red' | 'green' | 'purple';
}

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30',
    red: 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30',
    green: 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30',
    purple: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30',
  };

  const iconClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    red: 'bg-gradient-to-br from-red-500 to-red-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
  };

  const icons = {
    blue: '🔒',
    red: '💰',
    green: '💳',
    purple: '🏛️',
  };

  return (
    <div className={`rounded-3xl border p-6 ${colorClasses[color]} backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${iconClasses[color]} rounded-2xl flex items-center justify-center shadow-lg`}>
          <span className="text-white text-lg">{icons[color]}</span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold mb-1 text-white">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function getHealthStatus(ratio: string): string {
  const numRatio = parseFloat(ratio);
  if (numRatio >= 200) return 'Healthy';
  if (numRatio >= 150) return 'Warning';
  return 'At Risk';
}

function getHealthColor(ratio: string): string {
  const numRatio = parseFloat(ratio);
  if (numRatio >= 200) return 'text-green-600';
  if (numRatio >= 150) return 'text-yellow-600';
  return 'text-red-600';
}

function getHealthBarColor(ratio: string): string {
  const numRatio = parseFloat(ratio);
  if (numRatio >= 200) return 'bg-gradient-to-r from-green-500 to-emerald-500';
  if (numRatio >= 150) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
  return 'bg-gradient-to-r from-red-500 to-red-600';
}

function getHealthDotColor(ratio: string): string {
  const numRatio = parseFloat(ratio);
  if (numRatio >= 200) return 'bg-green-500 shadow-lg shadow-green-500/50';
  if (numRatio >= 150) return 'bg-yellow-500 shadow-lg shadow-yellow-500/50';
  return 'bg-red-500 shadow-lg shadow-red-500/50';
}