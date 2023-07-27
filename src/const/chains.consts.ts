import { ChainUrlInfo } from '@/types'

export const POLYGON_MUMBAI_CHAIN: ChainUrlInfo = {
  rpcUrl: 'https://polygon-mumbai-bor.publicnode.com',
  blockExplorerUrl: 'https://mumbai.polygonscan.com',
}

export const POLYGON_MAINNET_CHAIN: ChainUrlInfo = {
  rpcUrl: 'https://polygon-rpc.com',
  blockExplorerUrl: 'https://polygonscan.com/',
}

export const GOERLI_CHAIN: ChainUrlInfo = {
  rpcUrl: 'https://ethereum-goerli.publicnode.com',
  blockExplorerUrl: 'https://goerli.etherscan.io/',
}

export const SEPOLIA_CHAIN: ChainUrlInfo = {
  rpcUrl: 'https://rpc.notadegen.com/sepolia',
  blockExplorerUrl: 'https://sepolia.etherscan.io/',
}

export const Q_TESTNET_CHAIN: ChainUrlInfo = {
  rpcUrl: 'https://rpc.qtestnet.org',
  blockExplorerUrl: 'https://explorer.qtestnet.org/',
}

export const Q_MAINNET_CHAIN: ChainUrlInfo = {
  rpcUrl: 'https://rpc.q.org',
  blockExplorerUrl: 'https://explorer.q.org/',
}
