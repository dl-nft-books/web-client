import { ref, watch } from 'vue'
import { NftBookToken, NftBookToken__factory } from '@/types'
import { ethers } from 'ethers'

import {
  DesignatedProvider,
  ChainId,
  TransactionResponse,
  TxRequestBody,
} from '@/types'
import { PROVIDERS } from '@/enums'

export interface UseUnrefProvider {
  currentProvider: ethers.providers.Web3Provider | undefined
  currentSigner: ethers.providers.JsonRpcSigner | undefined

  selectedProvider: PROVIDERS | undefined
  chainId: ChainId | undefined
  selectedAddress: string | undefined
  isConnected: boolean

  init: (provider: DesignatedProvider) => Promise<void>
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: ChainId) => Promise<void>
  addChain: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
  ) => Promise<void>
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
}

export const useNftBookToken = (
  provider: UseUnrefProvider,
  address?: string,
) => {
  const _instance = ref<NftBookToken | undefined>()
  const _instance_rw = ref<NftBookToken | undefined>()

  watch(provider, () => {
    if (address) init(address)
  })

  if (address && provider.currentProvider && provider.currentSigner) {
    _instance.value = NftBookToken__factory.connect(
      address,
      provider.currentProvider,
    )
    _instance_rw.value = NftBookToken__factory.connect(
      address,
      provider.currentSigner,
    )
  }

  const init = (address: string) => {
    if (address && provider.currentProvider && provider.currentSigner) {
      _instance.value = NftBookToken__factory.connect(
        address,
        provider.currentProvider,
      )
      _instance_rw.value = NftBookToken__factory.connect(
        address,
        provider.currentSigner,
      )
    }
  }

  const mintToken = async (
    tokenAddress: string,
    price: string,
    endTimestamp: number,
    tokenUri: string,
    r: string,
    s: string,
    v: number,
    value?: string,
  ) => {
    const options = value ? { value } : undefined

    const contractTransaction = await _instance_rw.value?.mintToken(
      tokenAddress,
      price,
      endTimestamp,
      tokenUri,
      r,
      s,
      v,
      options,
    )

    return contractTransaction
  }

  const getUserTokenIDs = async (address: string) => {
    const contractTransaction = await _instance.value?.getUserTokenIDs(address)

    return contractTransaction
  }

  return {
    init,
    mintToken,
    getUserTokenIDs,
  }
}
