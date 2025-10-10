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
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-surface-200 to-surface-300 rounded-4xl flex items-center justify-center mx-auto mb-6">
          <span className="text-primary-600 text-3xl">🔗</span>
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-surface-700">
          Connect your wallet to access the banking system and manage your positions
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-surface-300 border-t-primary-600 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-surface-900 mb-2">Loading Dashboard</h2>
        <p className="text-surface-700">Fetching your banking data...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-surface-900 mb-3">
          Banking Dashboard
        </h1>
        <p className="text-surface-700 text-lg">Manage your collateral and stablecoin positions</p>
      </div>

      {/* Account Info */}
      <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl p-8 mb-8 border border-surface-400/50 shadow-material-lg animate-slide-up">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-material-md">
            <span className="text-white text-2xl">👤</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-700 mb-2 uppercase tracking-wide">Connected Account</h3>
            <p className="font-mono text-lg text-surface-900 bg-surface-300/50 px-4 py-2 rounded-2xl border border-surface-400/50">{address}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Collateral in Vault"
          value={`${parseFloat(collateralInVault).toFixed(4)} ETH`}
          subtitle="Locked as collateral"
          color="primary"
        />
        <StatCard
          title="Borrowed Amount"
          value={`${parseFloat(daiDebt).toFixed(2)} BANK`}
          subtitle="Outstanding debt"
          color="error"
        />
        <StatCard
          title="Wallet Balance"
          value={`${parseFloat(collateralBalance).toFixed(4)} ETH`}
          subtitle="Available to deposit"
          color="success"
        />
        <StatCard
          title="Stablecoin Balance"
          value={`${parseFloat(stablecoinBalance).toFixed(2)} BANK`}
          subtitle="In your wallet"
          color="warning"
        />
      </div>

      {/* Collateralization Ratio */}
      <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-lg animate-slide-up">
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl flex items-center justify-center mr-6 shadow-material-md">
            <span className="text-white text-2xl">💚</span>
          </div>
          <h3 className="text-2xl font-bold text-surface-900">Position Health</h3>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-surface-700 mb-3 uppercase tracking-wide">Collateralization Ratio</p>
            <p className="text-4xl font-bold text-surface-900">{collateralizationRatio}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-surface-700 mb-3 uppercase tracking-wide">Status</p>
            <div className="flex items-center justify-end">
              <div className={`w-4 h-4 rounded-full mr-3 ${getHealthDotColor(collateralizationRatio)}`}></div>
              <p className={`text-xl font-bold ${getHealthColor(collateralizationRatio)}`}>
                {getHealthStatus(collateralizationRatio)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface-400 rounded-3xl h-4 overflow-hidden">
          <div
            className={`h-4 rounded-3xl transition-all duration-700 ease-out ${getHealthBarColor(collateralizationRatio)}`}
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
  color: 'primary' | 'error' | 'success' | 'warning';
}

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-surface-200 to-surface-300 border-primary-400/50 hover:border-primary-500/70',
    error: 'bg-gradient-to-br from-surface-200 to-surface-300 border-error-400/50 hover:border-error-500/70',
    success: 'bg-gradient-to-br from-surface-200 to-surface-300 border-success-400/50 hover:border-success-500/70',
    warning: 'bg-gradient-to-br from-surface-200 to-surface-300 border-warning-400/50 hover:border-warning-500/70',
  };

  const iconClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600',
    error: 'bg-gradient-to-br from-error-500 to-error-600',
    success: 'bg-gradient-to-br from-success-500 to-success-600',
    warning: 'bg-gradient-to-br from-warning-500 to-warning-600',
  };

  const textClasses = {
    primary: 'text-surface-900',
    error: 'text-surface-900',
    success: 'text-surface-900',
    warning: 'text-surface-900',
  };

  const icons = {
    primary: '🔒',
    error: '💰',
    success: '💳',
    warning: '🏛️',
  };

  return (
    <div className={`rounded-4xl border-2 p-8 ${colorClasses[color]} backdrop-blur-xl shadow-material-lg hover:shadow-material-xl transition-all duration-300 hover:scale-105 animate-scale-in`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 ${iconClasses[color]} rounded-3xl flex items-center justify-center shadow-material-md`}>
          <span className="text-white text-xl">{icons[color]}</span>
        </div>
      </div>
      <h3 className="text-sm font-bold text-surface-700 mb-3 uppercase tracking-wide">{title}</h3>
      <p className={`text-3xl font-bold mb-2 ${textClasses[color]}`}>{value}</p>
      <p className="text-sm text-surface-600 font-medium">{subtitle}</p>
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
  if (numRatio >= 200) return 'text-success-600';
  if (numRatio >= 150) return 'text-warning-600';
  return 'text-error-600';
}

function getHealthBarColor(ratio: string): string {
  const numRatio = parseFloat(ratio);
  if (numRatio >= 200) return 'bg-gradient-to-r from-success-500 to-success-600';
  if (numRatio >= 150) return 'bg-gradient-to-r from-warning-500 to-warning-600';
  return 'bg-gradient-to-r from-error-500 to-error-600';
}

function getHealthDotColor(ratio: string): string {
  const numRatio = parseFloat(ratio);
  if (numRatio >= 200) return 'bg-success-500 shadow-material-md';
  if (numRatio >= 150) return 'bg-warning-500 shadow-material-md';
  return 'bg-error-500 shadow-material-md';
}