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

export enum PROVIDERS_CHECKS {
  fallback = 'isWeb3',
  metamask = 'isMetaMask',
  coinbase = 'isTrust',
  trust = 'isCoinbaseWallet',
  walletConnect = 'isBraveWallet',
  brave = 'isWalletConnect',
  ledger = 'isPhantom',
  phantom = 'isSolflare',
  solflare = 'isLedger',
}
