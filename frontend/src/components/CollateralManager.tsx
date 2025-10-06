import { useState } from 'react';
import { useBankingOperations } from '../hooks/useBankingOperations';
import { useBankingData } from '../hooks/useBankingData';
import { useAccount } from 'wagmi';

export function CollateralManager() {
  const { isConnected } = useAccount();
  const { depositCollateral, withdrawCollateral, isLoading } = useBankingOperations();
  const { collateralBalance, collateralInVault, refetch } = useBankingData();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    
    try {
      await depositCollateral(depositAmount);
      setDepositAmount('');
      refetch();
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    
    try {
      await withdrawCollateral(withdrawAmount);
      setWithdrawAmount('');
      refetch();
    } catch (error) {
      console.error('Withdraw failed:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Collateral Management</h2>
        <p className="text-gray-400">Connect your wallet to manage collateral</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
          <span className="text-white text-xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Collateral Management</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex bg-gray-700/50 rounded-2xl p-1 mb-8">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 ${
            activeTab === 'deposit'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
          }`}
        >
          💰 Deposit
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 ${
            activeTab === 'withdraw'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
          }`}
        >
          💸 Withdraw
        </button>
      </div>

      {/* Balances Display */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white text-sm">💳</span>
            </div>
            <p className="text-sm font-medium text-gray-400">Wallet Balance</p>
          </div>
          <p className="text-xl font-bold text-white">{parseFloat(collateralBalance).toFixed(4)} ETH</p>
        </div>
        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white text-sm">🏛️</span>
            </div>
            <p className="text-sm font-medium text-gray-400">In Vault</p>
          </div>
          <p className="text-xl font-bold text-white">{parseFloat(collateralInVault).toFixed(4)} ETH</p>
        </div>
      </div>

      {/* Deposit Tab */}
      {activeTab === 'deposit' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Amount to Deposit (ETH)
            </label>
            <div className="relative">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-6 py-4 border border-gray-600/50 bg-gray-700/50 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-lg font-semibold"
                step="0.01"
                min="0"
                max={collateralBalance}
              />
              <button
                onClick={() => setDepositAmount(collateralBalance)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Max
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDeposit}
            disabled={isLoading || !depositAmount || parseFloat(depositAmount) <= 0}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              '💰 Deposit Collateral'
            )}
          </button>
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === 'withdraw' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Amount to Withdraw (ETH)
            </label>
            <div className="relative">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-6 py-4 border border-gray-600/50 bg-gray-700/50 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm text-lg font-semibold"
                step="0.01"
                min="0"
                max={collateralInVault}
              />
              <button
                onClick={() => setWithdrawAmount(collateralInVault)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-3 py-1 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Max
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-sm">⚠️</span>
              </div>
              <p className="text-sm text-yellow-200 font-medium">
                Ensure you maintain sufficient collateralization ratio after withdrawal
              </p>
            </div>
          </div>
          
          <button
            onClick={handleWithdraw}
            disabled={isLoading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              '💸 Withdraw Collateral'
            )}
          </button>
        </div>
      )}
    </div>
  );
}