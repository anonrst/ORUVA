import { useState } from 'react';
import { useBankingOperations } from '../hooks/useBankingOperations';
import { useBankingData } from '../hooks/useBankingData';
import { useAccount } from 'wagmi';

export function StablecoinManager() {
  const { isConnected } = useAccount();
  const { borrowINRC, repayINRC, isLoading } = useBankingOperations();
  const { daiDebt, stablecoinBalance, collateralInVault, refetch } = useBankingData();

  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'borrow' | 'repay'>('borrow');

  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) return;

    try {
      await borrowINRC(borrowAmount);
      setBorrowAmount('');
      refetch();
    } catch (error) {
      console.error('Borrow failed:', error);
    }
  };

  const handleRepay = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) return;

    try {
      await repayINRC(repayAmount);
      setRepayAmount('');
      refetch();
    } catch (error) {
      console.error('Repay failed:', error);
    }
  };

  // Calculate max borrowable amount (simplified - 50% of collateral value)
  const maxBorrowable = (parseFloat(collateralInVault) * 0.5).toFixed(2);

  if (!isConnected) {
    return (
      <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-lg animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl flex items-center justify-center mr-6 shadow-material-md">
            <span className="text-white text-2xl">💰</span>
          </div>
          <h2 className="text-2xl font-bold text-surface-900">Stablecoin Management</h2>
        </div>
        <p className="text-surface-700 font-medium">Connect your wallet to manage stablecoins</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-lg animate-fade-in">
      <div className="flex items-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl flex items-center justify-center mr-6 shadow-material-md">
          <span className="text-white text-2xl">💰</span>
        </div>
        <h2 className="text-2xl font-bold text-surface-900">Stablecoin Management</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-surface-300/50 rounded-3xl p-2 mb-8 border-2 border-surface-400/50">
        <button
          onClick={() => setActiveTab('borrow')}
          className={`flex-1 px-8 py-4 font-bold text-lg rounded-2xl transition-all duration-300 ${activeTab === 'borrow'
            ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-material-md transform scale-105'
            : 'text-surface-700 hover:text-surface-900 hover:bg-surface-300/30'
            }`}
        >
          📈 Borrow
        </button>
        <button
          onClick={() => setActiveTab('repay')}
          className={`flex-1 px-8 py-4 font-bold text-lg rounded-2xl transition-all duration-300 ${activeTab === 'repay'
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-material-md transform scale-105'
            : 'text-surface-700 hover:text-surface-900 hover:bg-surface-300/30'
            }`}
        >
          💳 Repay
        </button>
      </div>

      {/* Balances Display */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-surface-300 to-surface-400 rounded-3xl p-6 border-2 border-error-400/50">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-error-500 to-error-600 rounded-2xl flex items-center justify-center mr-4 shadow-material-md">
              <span className="text-white text-lg">📊</span>
            </div>
            <p className="text-sm font-bold text-error-600 uppercase tracking-wide">Outstanding Debt</p>
          </div>
          <p className="text-2xl font-bold text-surface-900">{parseFloat(daiDebt).toFixed(2)} BANK</p>
        </div>
        <div className="bg-gradient-to-br from-surface-300 to-surface-400 rounded-3xl p-6 border-2 border-warning-400/50">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mr-4 shadow-material-md">
              <span className="text-white text-lg">💎</span>
            </div>
            <p className="text-sm font-bold text-warning-600 uppercase tracking-wide">Wallet Balance</p>
          </div>
          <p className="text-2xl font-bold text-surface-900">{parseFloat(stablecoinBalance).toFixed(2)} BANK</p>
        </div>
      </div>

      {/* Borrow Tab */}
      {activeTab === 'borrow' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-surface-700 mb-4 uppercase tracking-wide">
              Amount to Borrow (BANK)
            </label>
            <div className="relative">
              <input
                type="number"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-6 py-4 border-2 border-surface-400/50 bg-surface-300/50 text-surface-900 rounded-3xl focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-success-500 text-xl font-bold transition-all duration-200"
                step="0.01"
                min="0"
                max={maxBorrowable}
              />
              <button
                onClick={() => setBorrowAmount(maxBorrowable)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-success-500 to-success-600 text-white px-4 py-2 rounded-2xl text-sm font-bold hover:from-success-600 hover:to-success-700 transition-all duration-200 shadow-material-md"
              >
                Max
              </button>
            </div>
            <p className="text-sm text-surface-600 mt-3 font-medium">
              Max borrowable: {maxBorrowable} BANK (50% of collateral)
            </p>
          </div>

          <div className="bg-gradient-to-r from-surface-300 to-surface-400 border-2 border-primary-400/50 rounded-3xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-material-md">
                <span className="text-white text-lg">💡</span>
              </div>
              <p className="text-primary-600 font-bold">
                Maintain a healthy collateralization ratio above 150%
              </p>
            </div>
          </div>

          <button
            onClick={handleBorrow}
            disabled={isLoading || !borrowAmount || parseFloat(borrowAmount) <= 0 || parseFloat(collateralInVault) === 0}
            className="w-full bg-gradient-to-r from-success-500 to-success-600 text-white py-5 px-8 rounded-3xl font-bold text-xl hover:from-success-600 hover:to-success-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-lg hover:shadow-material-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                Processing...
              </div>
            ) : (
              '📈 Borrow BANK'
            )}
          </button>

          {parseFloat(collateralInVault) === 0 && (
            <div className="bg-surface-300 border-2 border-error-400/50 rounded-3xl p-4">
              <p className="text-error-600 font-bold text-center">
                Deposit collateral first to borrow stablecoins
              </p>
            </div>
          )}
        </div>
      )}

      {/* Repay Tab */}
      {activeTab === 'repay' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-surface-700 mb-4 uppercase tracking-wide">
              Amount to Repay (BANK)
            </label>
            <div className="relative">
              <input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-6 py-4 border-2 border-surface-400/50 bg-surface-300/50 text-surface-900 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xl font-bold transition-all duration-200"
                step="0.01"
                min="0"
                max={Math.min(parseFloat(daiDebt), parseFloat(stablecoinBalance)).toString()}
              />
              <button
                onClick={() => setRepayAmount(Math.min(parseFloat(daiDebt), parseFloat(stablecoinBalance)).toString())}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-2xl text-sm font-bold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-material-md"
              >
                Max
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-surface-300 to-surface-400 border-2 border-success-400/50 rounded-3xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mr-4 shadow-material-md">
                <span className="text-white text-lg">✅</span>
              </div>
              <p className="text-success-600 font-bold">
                Repaying debt improves your collateralization ratio
              </p>
            </div>
          </div>

          <button
            onClick={handleRepay}
            disabled={isLoading || !repayAmount || parseFloat(repayAmount) <= 0 || parseFloat(daiDebt) === 0}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-5 px-8 rounded-3xl font-bold text-xl hover:from-primary-600 hover:to-primary-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-lg hover:shadow-material-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                Processing...
              </div>
            ) : (
              '💳 Repay BANK'
            )}
          </button>

          {parseFloat(daiDebt) === 0 && (
            <div className="bg-surface-300 border-2 border-surface-400/50 rounded-3xl p-4">
              <p className="text-surface-700 font-bold text-center">
                No outstanding debt to repay
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}