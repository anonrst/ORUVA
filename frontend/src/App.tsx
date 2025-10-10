import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { WalletConnect } from './components/WalletConnect';
import { Dashboard } from './components/Dashboard';
import { CollateralManager } from './components/CollateralManager';
import { StablecoinManager } from './components/StablecoinManager';
import { SavingsManager } from './components/SavingsManager';
import { LiquidationMonitor } from './components/LiquidationMonitor';
import { SystemManager } from './components/SystemManager';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#0ea5e9',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'large',
        })}>
          <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-200">
            {/* Header */}
            <header className="bg-surface-100/80 backdrop-blur-xl border-b border-surface-300/50 sticky top-0 z-50 shadow-material">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="flex justify-between items-center h-20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-material-md">
                      <span className="text-white text-xl font-bold">🏦</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-surface-900">Web3 Banking</h1>
                      <p className="text-sm text-surface-700">Decentralized Finance Platform</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <CollateralManager />
                <StablecoinManager />
              </div>

              {/* Advanced Features */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <SavingsManager />
                <LiquidationMonitor />
              </div>

              {/* System Management */}
              <div className="mt-8">
                <SystemManager />
              </div>

              {/* Instructions */}
              <div className="mt-12 bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-xl animate-fade-in">
                <h3 className="text-2xl font-bold mb-8 text-surface-900 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-material-md">
                    💡
                  </span>
                  How to Use
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start group hover:bg-surface-300/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-material-md">
                    <span className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl w-10 h-10 flex items-center justify-center text-sm font-bold mr-6 mt-1 shadow-material-md">1</span>
                    <div>
                      <p className="font-bold text-surface-900 mb-2 text-lg">Deposit Collateral</p>
                      <p className="text-surface-700">Lock your ETH as collateral to secure loans and start borrowing</p>
                    </div>
                  </div>
                  <div className="flex items-start group hover:bg-surface-300/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-material-md">
                    <span className="bg-gradient-to-br from-success-500 to-success-600 text-white rounded-2xl w-10 h-10 flex items-center justify-center text-sm font-bold mr-6 mt-1 shadow-material-md">2</span>
                    <div>
                      <p className="font-bold text-surface-900 mb-2 text-lg">Borrow Stablecoins</p>
                      <p className="text-surface-700">Mint BANK tokens against your collateral (max 50% of collateral value)</p>
                    </div>
                  </div>
                  <div className="flex items-start group hover:bg-surface-300/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-material-md">
                    <span className="bg-gradient-to-br from-warning-500 to-warning-600 text-white rounded-2xl w-10 h-10 flex items-center justify-center text-sm font-bold mr-6 mt-1 shadow-material-md">3</span>
                    <div>
                      <p className="font-bold text-surface-900 mb-2 text-lg">Maintain Health</p>
                      <p className="text-surface-700">Keep your collateralization ratio above 150% to avoid liquidation</p>
                    </div>
                  </div>
                  <div className="flex items-start group hover:bg-surface-300/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-material-md">
                    <span className="bg-gradient-to-br from-accent-purple to-accent-pink text-white rounded-2xl w-10 h-10 flex items-center justify-center text-sm font-bold mr-6 mt-1 shadow-material-md">4</span>
                    <div>
                      <p className="font-bold text-surface-900 mb-2 text-lg">Repay & Withdraw</p>
                      <p className="text-surface-700">Repay your debt to unlock and withdraw your collateral safely</p>
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
