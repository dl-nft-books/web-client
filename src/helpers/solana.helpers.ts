import { errors } from '@/errors'
import { SolProviderRpcError } from '@/types'
import { Transaction } from '@solana/web3.js'
import bs58 from 'bs58'
import { SOLANA_CHAINS } from '@/enums'

export function handleSolError(error: SolProviderRpcError) {
  const ErrorCode = error?.error?.code || error?.code

  switch (ErrorCode) {
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

export function convertEncodedSolTx(encodedTx: string) {
  return Transaction.from(bs58.decode(encodedTx))
}

export function getSolExplorerTxUrl(
  chainId: string,
  explorerUrl: string,
  txHash: string,
) {
  return chainId === SOLANA_CHAINS.mainet
    ? `${explorerUrl}/tx/${txHash}`
    : `${explorerUrl}/tx/${txHash}?cluster=${chainId}`
}

export function getSolExplorerAddressUrl(
  chainId: string,
  explorerUrl: string,
  address: string,
) {
  return chainId === SOLANA_CHAINS.mainet
    ? `${explorerUrl}/address/${address}`
    : `${explorerUrl}/address/${address}?cluster=${chainId}`
}
