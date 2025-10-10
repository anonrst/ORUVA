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
      <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-lg animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mr-6 shadow-material-md">
            <span className="text-white text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-surface-900">Collateral Management</h2>
        </div>
        <p className="text-surface-700 font-medium">Connect your wallet to manage collateral</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-lg animate-fade-in">
      <div className="flex items-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mr-6 shadow-material-md">
          <span className="text-white text-2xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold text-surface-900">Collateral Management</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex bg-surface-300/50 rounded-3xl p-2 mb-8 border-2 border-surface-400/50">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 px-8 py-4 font-bold text-lg rounded-2xl transition-all duration-300 ${
            activeTab === 'deposit'
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-material-md transform scale-105'
              : 'text-surface-700 hover:text-surface-900 hover:bg-surface-300/30'
          }`}
        >
          💰 Deposit
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 px-8 py-4 font-bold text-lg rounded-2xl transition-all duration-300 ${
            activeTab === 'withdraw'
              ? 'bg-gradient-to-r from-error-500 to-error-600 text-white shadow-material-md transform scale-105'
              : 'text-surface-700 hover:text-surface-900 hover:bg-surface-300/30'
          }`}
        >
          💸 Withdraw
        </button>
      </div>

      {/* Balances Display */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-surface-300 to-surface-400 rounded-3xl p-6 border-2 border-success-400/50">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mr-4 shadow-material-md">
              <span className="text-white text-lg">💳</span>
            </div>
            <p className="text-sm font-bold text-success-600 uppercase tracking-wide">Wallet Balance</p>
          </div>
          <p className="text-2xl font-bold text-surface-900">{parseFloat(collateralBalance).toFixed(4)} ETH</p>
        </div>
        <div className="bg-gradient-to-br from-surface-300 to-surface-400 rounded-3xl p-6 border-2 border-primary-400/50">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-material-md">
              <span className="text-white text-lg">🏛️</span>
            </div>
            <p className="text-sm font-bold text-primary-600 uppercase tracking-wide">In Vault</p>
          </div>
          <p className="text-2xl font-bold text-surface-900">{parseFloat(collateralInVault).toFixed(4)} ETH</p>
        </div>
      </div>

      {/* Deposit Tab */}
      {activeTab === 'deposit' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-surface-700 mb-4 uppercase tracking-wide">
              Amount to Deposit (ETH)
            </label>
            <div className="relative">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-6 py-4 border-2 border-surface-400/50 bg-surface-300/50 text-surface-900 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xl font-bold transition-all duration-200"
                step="0.01"
                min="0"
                max={collateralBalance}
              />
              <button
                onClick={() => setDepositAmount(collateralBalance)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-2xl text-sm font-bold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-material-md"
              >
                Max
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDeposit}
            disabled={isLoading || !depositAmount || parseFloat(depositAmount) <= 0}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-5 px-8 rounded-3xl font-bold text-xl hover:from-primary-600 hover:to-primary-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-lg hover:shadow-material-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
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
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-surface-700 mb-4 uppercase tracking-wide">
              Amount to Withdraw (ETH)
            </label>
            <div className="relative">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-6 py-4 border-2 border-surface-400/50 bg-surface-300/50 text-surface-900 rounded-3xl focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-error-500 text-xl font-bold transition-all duration-200"
                step="0.01"
                min="0"
                max={collateralInVault}
              />
              <button
                onClick={() => setWithdrawAmount(collateralInVault)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-error-500 to-error-600 text-white px-4 py-2 rounded-2xl text-sm font-bold hover:from-error-600 hover:to-error-700 transition-all duration-200 shadow-material-md"
              >
                Max
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-surface-300 to-surface-400 border-2 border-warning-400/50 rounded-3xl p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mr-4 shadow-material-md">
                <span className="text-white text-lg">⚠️</span>
              </div>
              <p className="text-warning-600 font-bold">
                Ensure you maintain sufficient collateralization ratio after withdrawal
              </p>
            </div>
          </div>
          
          <button
            onClick={handleWithdraw}
            disabled={isLoading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
            className="w-full bg-gradient-to-r from-error-500 to-error-600 text-white py-5 px-8 rounded-3xl font-bold text-xl hover:from-error-600 hover:to-error-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-lg hover:shadow-material-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
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