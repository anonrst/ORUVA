import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { WalletConnect } from './components/WalletConnect';
import { Dashboard } from './components/Dashboard';
import { CollateralManager } from './components/CollateralManager';
import { StablecoinManager } from './components/StablecoinManager';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#3b82f6',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'large',
        })}>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20">
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="flex justify-between items-center h-20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-lg font-bold">🏦</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">Web3 Banking</h1>
                      <p className="text-xs text-gray-400">Decentralized Finance</p>
                    </div>
                  </div>
                  <WalletConnect />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
              {/* Dashboard */}
              <Dashboard />

              {/* Banking Operations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <CollateralManager />
                <StablecoinManager />
              </div>

              {/* Instructions */}
              <div className="mt-12 bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    💡
                  </span>
                  How to Use
                </h3>
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex items-start group hover:bg-gray-700/30 rounded-2xl p-4 transition-all duration-200">
                    <span className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl w-8 h-8 flex items-center justify-center text-xs font-bold mr-4 mt-0.5 shadow-lg">1</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Deposit Collateral</p>
                      <p className="text-gray-400">Lock your ETH as collateral to secure loans</p>
                    </div>
                  </div>
                  <div className="flex items-start group hover:bg-gray-700/30 rounded-2xl p-4 transition-all duration-200">
                    <span className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl w-8 h-8 flex items-center justify-center text-xs font-bold mr-4 mt-0.5 shadow-lg">2</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Borrow Stablecoins</p>
                      <p className="text-gray-400">Mint BANK tokens against your collateral (max 50% of collateral value)</p>
                    </div>
                  </div>
                  <div className="flex items-start group hover:bg-gray-700/30 rounded-2xl p-4 transition-all duration-200">
                    <span className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl w-8 h-8 flex items-center justify-center text-xs font-bold mr-4 mt-0.5 shadow-lg">3</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Maintain Health</p>
                      <p className="text-gray-400">Keep your collateralization ratio above 150% to avoid liquidation</p>
                    </div>
                  </div>
                  <div className="flex items-start group hover:bg-gray-700/30 rounded-2xl p-4 transition-all duration-200">
                    <span className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl w-8 h-8 flex items-center justify-center text-xs font-bold mr-4 mt-0.5 shadow-lg">4</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Repay & Withdraw</p>
                      <p className="text-gray-400">Repay your debt to unlock and withdraw your collateral</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
