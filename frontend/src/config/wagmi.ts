import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'viem/chains';

// Custom localhost chain configuration
export const localhost = {
    id: 31337,
    name: 'Localhost',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
        public: { http: ['http://127.0.0.1:8545'] },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'http://localhost' },
    },
} as const;

export const config = getDefaultConfig({
    appName: 'Web3 Banking App',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
    chains: [localhost, sepolia, mainnet],
    ssr: false,
});