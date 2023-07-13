import { EthProviderRpcError, NativeCurrency } from '@/types'
import { ChainId } from '@distributedlab/w3p'
import { errors } from '@/errors'
import { ethers } from 'ethers'
import {
  EIP1193,
  EIP1474,
  EIP1193String,
  Q_CHAINS,
  ETHEREUM_CHAINS,
  POLYGON_CHAINS,
} from '@/enums'
import { isMobile } from '@/helpers'
import {
  POLYGON_MAINNET_CHAIN,
  POLYGON_MUMBAI_CHAIN,
  Q_MAINNET_CHAIN,
  Q_TESTNET_CHAIN,
  SEPOLIA_CHAIN,
} from '@/const'
import { config } from '@/config'

type SupportedChain = ETHEREUM_CHAINS | POLYGON_CHAINS | Q_CHAINS

export const getJsonRpcProvider = (
  chain: ChainId,
): ethers.providers.JsonRpcProvider => {
  switch (chain.toString() as SupportedChain) {
    case ETHEREUM_CHAINS.sepolia:
      return new ethers.providers.JsonRpcProvider(SEPOLIA_CHAIN.rpcUrl, 'any')
    case Q_CHAINS.mainet:
      return new ethers.providers.JsonRpcProvider(Q_MAINNET_CHAIN.rpcUrl, 'any')
    case Q_CHAINS.testnet:
      return new ethers.providers.JsonRpcProvider(Q_TESTNET_CHAIN.rpcUrl, 'any')
    case POLYGON_CHAINS.mumbai:
      return new ethers.providers.JsonRpcProvider(
        POLYGON_MUMBAI_CHAIN.rpcUrl,
        'any',
      )
    case POLYGON_CHAINS.mainnet:
      return new ethers.providers.JsonRpcProvider(
        POLYGON_MAINNET_CHAIN.rpcUrl,
        'any',
      )
    default:
      return new ethers.providers.JsonRpcProvider(
        config.DEPLOY_ENVIRONMENT === 'development'
          ? POLYGON_MUMBAI_CHAIN.rpcUrl
          : POLYGON_MAINNET_CHAIN.rpcUrl,
        'any',
      )
  }
}

export const connectEthAccounts = async (
  provider: ethers.providers.Web3Provider,
) => {
  await provider.send('eth_requestAccounts', [])
}

export async function requestSwitchEthChain(
  provider: ethers.providers.Web3Provider,
  chainId: number,
) {
  await provider.send('wallet_switchEthereumChain', [
    { chainId: ethers.utils.hexValue(chainId) },
  ])
}

export async function requestAddEthChain(
  provider: ethers.providers.Web3Provider,
  chainId: number,
  chainName: string,
  chainRpcUrl: string,
  nativeCurrency: NativeCurrency,
  blockExplorerUrl: string,
) {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: ethers.utils.hexValue(chainId),
      chainName,
      rpcUrls: [chainRpcUrl],
      nativeCurrency,
      blockExplorerUrls: [blockExplorerUrl],
    },
  ])
}

export function handleEthError(error: EthProviderRpcError) {
  switch (error.code) {
    case EIP1193.userRejectedRequest:
    case EIP1193String.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest(error.message)
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized(error.message)
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod(error.message)
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected(error.message)
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected(error.message)
    case EIP1193.walletMissingChain:
      throw new errors.ProviderChainNotFoundError(error.message)
    case EIP1474.parseError:
      throw new errors.ProviderParseError(error.message)
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest(error.message)
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound(error.message)
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams(error.message)
    case EIP1474.internalError:
      /* 
        in mobile version of metamask this error throws internal error 
        instead of 4902 for some reason thats why this line appears
      */
      if (isMobile()) throw new errors.ProviderChainNotFoundError(error.message)
      throw new errors.ProviderInternalError(error.message)
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput(error.message)
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound(error.message)
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable(error.message)
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected(error.message)
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported(error.message)
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded(error.message)
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported(error.message)
    default:
      throw error
  }
}

export function getEthExplorerTxUrl(explorerUrl: string, txHash: string) {
  return `${explorerUrl}/tx/${txHash}`
}

export function getEthExplorerAddressUrl(explorerUrl: string, address: string) {
  return `${explorerUrl}/address/${address}`
}
