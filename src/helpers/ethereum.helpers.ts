import { EthProviderRpcError } from '@/types'
import { errors } from '@/errors'
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
      throw new errors.ProviderUserRejectedRequest()
    case 4100:
      throw new errors.ProviderUnauthorized()
    case 4200:
      throw new errors.ProviderUnsupportedMethod()
    case 4900:
      throw new errors.ProviderDisconnected()
    case 4901:
      throw new errors.ProviderChainDisconnected()
    case -32700:
      throw new errors.ProviderParseError()
    case -32600:
      throw new errors.ProviderInvalidRequest()
    case -32601:
      throw new errors.ProviderMethodNotFound()
    case -32602:
      throw new errors.ProviderInvalidParams()
    case -32603:
      throw new errors.ProviderInternalError()
    case -32000:
      throw new errors.ProviderInvalidInput()
    case -32001:
      throw new errors.ProviderResourceNotFound()
    case -32002:
      throw new errors.ProviderResourceUnavailable()
    case -32003:
      throw new errors.ProviderTransactionRejected()
    case -32004:
      throw new errors.ProviderMethodNotSupported()
    case -32005:
      throw new errors.ProviderLimitExceeded()
    case -32006:
      throw new errors.ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}
