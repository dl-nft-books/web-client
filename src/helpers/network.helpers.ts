import { config } from '@/config'
import { POLYGON_MUMBAI_CHAIN, Q_TESTNET_CHAIN } from '@/const'
import {
  ETHEREUM_CHAINS,
  NETWORKS,
  POLYGON_CHAINS,
  Q_CHAINS,
  ICON_NAMES,
} from '@/enums'
import { ChainId, ChainUrlInfo } from '@/types'

export function getNetworkScheme(chainID: ChainId): string {
  switch (chainID?.toString()) {
    case ETHEREUM_CHAINS.ethereum:
    case ETHEREUM_CHAINS.goerli:
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

export function getIconByScheme(scheme: NETWORKS): ICON_NAMES {
  switch (scheme) {
    case 'polygon':
      return ICON_NAMES.polygon
    case 'ethereum':
      return ICON_NAMES.ethereum
    case 'q':
      return ICON_NAMES.q
    case 'unsupported':
    default:
      return ICON_NAMES.ban
  }
}

// For non-default chains
export function getNetworkInfo(chainID: ChainId): ChainUrlInfo | null {
  switch (chainID.toString()) {
    case POLYGON_CHAINS.mumbai:
      return POLYGON_MUMBAI_CHAIN
    case Q_CHAINS.testnet:
      return Q_TESTNET_CHAIN
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
      return isProduction ? ETHEREUM_CHAINS.ethereum : ETHEREUM_CHAINS.goerli
    case NETWORKS.Q:
      return isProduction ? Q_CHAINS.mainet : Q_CHAINS.testnet
    default:
      return ''
  }
}
