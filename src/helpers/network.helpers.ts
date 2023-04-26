import { config } from '@/config'
import {
  POLYGON_MAINNET_CHAIN,
  POLYGON_MUMBAI_CHAIN,
  Q_MAINNET_CHAIN,
  Q_TESTNET_CHAIN,
  SEPOLIA_CHAIN,
} from '@/const'
import {
  ETHEREUM_CHAINS,
  NETWORKS,
  POLYGON_CHAINS,
  Q_CHAINS,
  ICON_NAMES,
  EIP1193,
} from '@/enums'
import { ChainId, ChainUrlInfo, EthProviderRpcError } from '@/types'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

export function getNetworkScheme(chainID: ChainId): NETWORKS {
  switch (chainID?.toString()) {
    case ETHEREUM_CHAINS.ethereum:
    case ETHEREUM_CHAINS.goerli:
    case ETHEREUM_CHAINS.sepolia:
      return NETWORKS.ETHEREUM
    case POLYGON_CHAINS.mainnet:
    case POLYGON_CHAINS.mumbai:
      return NETWORKS.POLYGON
    case Q_CHAINS.mainet:
    case Q_CHAINS.testnet:
      return NETWORKS.Q
    default:
      return NETWORKS.UNSUPPORTED
  }
}

export function getIconByScheme(
  scheme: NETWORKS,
  type = 'default' as 'default' | 'circle',
): ICON_NAMES {
  switch (scheme) {
    case NETWORKS.POLYGON:
      return type === 'circle' ? ICON_NAMES.polygonCircle : ICON_NAMES.polygon
    case NETWORKS.ETHEREUM:
      return type === 'circle' ? ICON_NAMES.ethereumCircle : ICON_NAMES.ethereum
    case NETWORKS.Q:
      return type === 'circle' ? ICON_NAMES.qCircle : ICON_NAMES.q
    case NETWORKS.UNSUPPORTED:
    default:
      return ICON_NAMES.ban
  }
}

// For non-default chains
export function getNetworkInfo(chainID: ChainId): ChainUrlInfo | null {
  switch (chainID.toString()) {
    case POLYGON_CHAINS.mumbai:
      return POLYGON_MUMBAI_CHAIN
    case POLYGON_CHAINS.mainnet:
      return POLYGON_MAINNET_CHAIN
    case Q_CHAINS.testnet:
      return Q_TESTNET_CHAIN
    case Q_CHAINS.mainet:
      return Q_MAINNET_CHAIN
    case ETHEREUM_CHAINS.sepolia:
      return SEPOLIA_CHAIN
    default:
      return null
  }
}

export function getChainFromNetwork(network: NETWORKS): string {
  const isProduction = config.DEPLOY_ENVIRONMENT === 'production'

  switch (network) {
    case NETWORKS.POLYGON:
      return isProduction ? POLYGON_CHAINS.mainnet : POLYGON_CHAINS.mumbai
    case NETWORKS.ETHEREUM:
      return isProduction ? ETHEREUM_CHAINS.ethereum : ETHEREUM_CHAINS.sepolia
    case NETWORKS.Q:
      return isProduction ? Q_CHAINS.mainet : Q_CHAINS.testnet
    default:
      return ''
  }
}

type LinkType = 'token' | 'tx'

export function getBlockExplorerLink(
  chainId: ChainId,
  token: string,
  linkType = 'token' as LinkType,
): string {
  switch (chainId?.toString()) {
    case POLYGON_CHAINS.mumbai:
      return `https://mumbai.polygonscan.com/${linkType}/${token}`
    case POLYGON_CHAINS.mainnet:
      return `https://polygonscan.com/${linkType}/${token}`
    case ETHEREUM_CHAINS.sepolia:
      return `https://sepolia.etherscan.io/${linkType}/${token}`
    case ETHEREUM_CHAINS.goerli:
      return `https://goerli.etherscan.io/${linkType}/${token}`
    case ETHEREUM_CHAINS.ethereum:
      return `https://etherscan.io/${linkType}/${token}`
    case Q_CHAINS.testnet:
      return `https://explorer.qtestnet.org/${linkType}/${token}`
    case Q_CHAINS.mainet:
      return `https://explorer.q.org/${linkType}/${token}`
    default:
      return `https://etherscan.io/${linkType}/${token}`
  }
}

export async function switchNetwork(chainID: ChainId) {
  const { provider } = useWeb3ProvidersStore()
  try {
    await provider.switchChain(chainID)
  } catch (error) {
    const ethError = error as EthProviderRpcError

    // if wallet has no chain added we need to add it and switch to it
    if (ethError?.code === EIP1193.walletMissingChain) {
      await provider.addNetwork(chainID)
      return
    }

    ErrorHandler.process(error)
  }
}
