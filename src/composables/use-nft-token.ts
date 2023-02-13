import { ref, watch } from 'vue'
import { NativeCurrency, NftBookToken, NftBookToken__factory } from '@/types'
import { ethers } from 'ethers'

import {
  DesignatedProvider,
  ChainId,
  TransactionResponse,
  TxRequestBody,
  EthProviderRpcError,
} from '@/types'
import { PROVIDERS } from '@/enums'
import { handleEthError } from '@/helpers'

interface UseUnrefProvider {
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
    nativeCurrency: NativeCurrency,
    blockExplorerUrl: string,
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
    discount: string,
    endTimestamp: number,
    tokenUri: string,
    r: string,
    s: string,
    v: number,
    value?: string,
  ) => {
    try {
      const contractTransaction = await _instance_rw.value?.mintToken(
        tokenAddress,
        price,
        discount,
        endTimestamp,
        tokenUri,
        r,
        s,
        v,
        ...(value ? [{ value }] : []),
      )

      return contractTransaction
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const mintTokenByNFT = async (
    nftAddress: string,
    nftFloorPrice: string,
    tokenId: string,
    endTimestamp: number,
    tokenURI: string,
    r: string,
    s: string,
    v: number,
  ) => {
    try {
      const contractTransaction = await _instance_rw.value?.minTokenByNFT(
        nftAddress,
        nftFloorPrice,
        tokenId,
        endTimestamp,
        tokenURI,
        r,
        s,
        v,
      )

      return contractTransaction
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getMinNFTFloorPrice = async () => {
    try {
      const contractTransaction = await _instance_rw.value?.minNFTFloorPrice()

      return contractTransaction
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getUserTokenIDs = (address: string) => {
    return _instance.value?.getUserTokenIDs(address)
  }

  return {
    init,
    mintToken,
    mintTokenByNFT,
    getMinNFTFloorPrice,
    getUserTokenIDs,
  }
}
