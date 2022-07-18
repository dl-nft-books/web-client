export enum PROVIDERS {
  fallback = 'fallback',
  metamask = 'metamask',
  coinbase = 'coinbase',
  trust = 'trust',
  walletConnect = 'wallet-connect',
  brave = 'brave',
  ledger = 'ledger',
  phantom = 'phantom',
  solflare = 'solflare',
}

export const PROVIDERS_CHECKS = {
  [PROVIDERS.fallback]: 'isWeb3',
  [PROVIDERS.metamask]: 'isMetaMask',
  [PROVIDERS.trust]: 'isTrust',
  [PROVIDERS.coinbase]: 'isCoinbaseWallet',
  [PROVIDERS.brave]: 'isBraveWallet',
  [PROVIDERS.walletConnect]: 'isWalletConnect',
  [PROVIDERS.phantom]: 'isPhantom',
  [PROVIDERS.solflare]: 'isSolflare',
  [PROVIDERS.ledger]: 'isLedger',
}
