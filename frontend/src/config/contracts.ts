// Contract addresses - Update these after deployment
export const CONTRACT_ADDRESSES = {
  CDP_ENGINE: '0x0000000000000000000000000000000000000000', // Update after deployment
  GEM_JOIN: '0x0000000000000000000000000000000000000000',   // Update after deployment
  DAI_JOIN: '0x0000000000000000000000000000000000000000',   // Update after deployment
  STABLECOIN: '0x0000000000000000000000000000000000000000', // Update after deployment
  COLLATERAL_TOKEN: '0x0000000000000000000000000000000000000000', // WETH or test token
} as const;

// Collateral type identifier (bytes32)
export const COLLATERAL_TYPE = '0x4554482d41000000000000000000000000000000000000000000000000000000'; // "ETH-A"

// Network configuration
export const SUPPORTED_CHAINS = {
  LOCALHOST: {
    id: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
  },
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  },
} as const;