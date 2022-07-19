import { EthProviderRpcError } from '@/types'
import {
  ProviderChainDisconnected,
  ProviderDisconnected,
  ProviderInternalError,
  ProviderInvalidInput,
  ProviderInvalidParams,
  ProviderInvalidRequest,
  ProviderJsonRpcVersionNotSupported,
  ProviderLimitExceeded,
  ProviderMethodNotFound,
  ProviderMethodNotSupported,
  ProviderParseError,
  ProviderResourceNotFound,
  ProviderResourceUnavailable,
  ProviderTransactionRejected,
  ProviderUnauthorized,
  ProviderUnsupportedMethod,
  ProviderUserRejectedRequest,
} from '@/errors'
import { ethers } from 'ethers'

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
) {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: ethers.utils.hexValue(chainId),
      chainName,
      rpcUrls: [chainRpcUrl],
    },
  ])
}

export function handleEthError(error: EthProviderRpcError) {
  switch (error.code) {
    case 4001:
      throw new ProviderUserRejectedRequest()
    case 4100:
      throw new ProviderUnauthorized()
    case 4200:
      throw new ProviderUnsupportedMethod()
    case 4900:
      throw new ProviderDisconnected()
    case 4901:
      throw new ProviderChainDisconnected()
    case -32700:
      throw new ProviderParseError()
    case -32600:
      throw new ProviderInvalidRequest()
    case -32601:
      throw new ProviderMethodNotFound()
    case -32602:
      throw new ProviderInvalidParams()
    case -32603:
      throw new ProviderInternalError()
    case -32000:
      throw new ProviderInvalidInput()
    case -32001:
      throw new ProviderResourceNotFound()
    case -32002:
      throw new ProviderResourceUnavailable()
    case -32003:
      throw new ProviderTransactionRejected()
    case -32004:
      throw new ProviderMethodNotSupported()
    case -32005:
      throw new ProviderLimitExceeded()
    case -32006:
      throw new ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}
