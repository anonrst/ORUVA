import { useState } from 'react';
import { useBankingOperations } from '../hooks/useBankingOperations';
import { useBankingData } from '../hooks/useBankingData';
import { useAccount } from 'wagmi';

export function StablecoinManager() {
  const { isConnected } = useAccount();
  const { borrowDAI, repayDAI, isLoading } = useBankingOperations();
  const { daiDebt, stablecoinBalance, collateralInVault, refetch } = useBankingData();

  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'borrow' | 'repay'>('borrow');

  const handleBorrow = async () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) return;

    try {
      await borrowDAI(borrowAmount);
      setBorrowAmount('');
      refetch();
    } catch (error) {
      console.error('Borrow failed:', error);
    }
  };

  const handleRepay = async () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) return;

    try {
      await repayDAI(repayAmount);
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
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Stablecoin Management</h2>
        <p className="text-gray-400">Connect your wallet to manage stablecoins</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
          <span className="text-white text-xl">💰</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Stablecoin Management</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-700/50 rounded-2xl p-1 mb-8">
        <button
          onClick={() => setActiveTab('borrow')}
          className={`flex-1 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 ${activeTab === 'borrow'
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
            : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
            }`}
        >
          📈 Borrow
        </button>
        <button
          onClick={() => setActiveTab('repay')}
          className={`flex-1 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 ${activeTab === 'repay'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
            : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
            }`}
        >
          💳 Repay
        </button>
      </div>

      {/* Balances Display */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white text-sm">📊</span>
            </div>
            <p className="text-sm font-medium text-gray-400">Outstanding Debt</p>
          </div>
          <p className="text-xl font-bold text-white">{parseFloat(daiDebt).toFixed(2)} BANK</p>
        </div>
        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white text-sm">💎</span>
            </div>
            <p className="text-sm font-medium text-gray-400">Wallet Balance</p>
          </div>
          <p className="text-xl font-bold text-white">{parseFloat(stablecoinBalance).toFixed(2)} BANK</p>
        </div>
      </div>

      {/* Borrow Tab */}
      {activeTab === 'borrow' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Amount to Borrow (BANK)
            </label>
            <div className="relative">
              <input
                type="number"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-6 py-4 border border-gray-600/50 bg-gray-700/50 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm text-lg font-semibold"
                step="0.01"
                min="0"
                max={maxBorrowable}
              />
              <button
                onClick={() => setBorrowAmount(maxBorrowable)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-3 py-1 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Max
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Max borrowable: {maxBorrowable} BANK (50% of collateral)
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-600/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-sm">💡</span>
              </div>
              <p className="text-sm text-blue-200 font-medium">
                Maintain a healthy collateralization ratio above 150%
              </p>
            </div>
          </div>

          <button
            onClick={handleBorrow}
            disabled={isLoading || !borrowAmount || parseFloat(borrowAmount) <= 0 || parseFloat(collateralInVault) === 0}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              '📈 Borrow BANK'
            )}
          </button>

          {parseFloat(collateralInVault) === 0 && (
            <p className="text-sm text-red-400 text-center">
              Deposit collateral first to borrow stablecoins
            </p>
          )}
        </div>
      )}

      {/* Repay Tab */}
      {activeTab === 'repay' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Amount to Repay (BANK)
            </label>
            <div className="relative">
              <input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-6 py-4 border border-gray-600/50 bg-gray-700/50 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-lg font-semibold"
                step="0.01"
                min="0"
                max={Math.min(parseFloat(daiDebt), parseFloat(stablecoinBalance)).toString()}
              />
              <button
                onClick={() => setRepayAmount(Math.min(parseFloat(daiDebt), parseFloat(stablecoinBalance)).toString())}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-600/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-sm">✅</span>
              </div>
              <p className="text-sm text-green-200 font-medium">
                Repaying debt improves your collateralization ratio
              </p>
            </div>
          </div>

          <button
            onClick={handleRepay}
            disabled={isLoading || !repayAmount || parseFloat(repayAmount) <= 0 || parseFloat(daiDebt) === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              '💳 Repay BANK'
            )}
          </button>

          {parseFloat(daiDebt) === 0 && (
            <p className="text-sm text-gray-400 text-center">
              No outstanding debt to repay
            </p>
          )}
        </div>
      )}
    </div>
  );
}