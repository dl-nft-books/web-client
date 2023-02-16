import { ref, watch } from 'vue'
import { NftBookToken, NftBookToken__factory, UnrefProvider } from '@/types'
import { EthProviderRpcError } from '@/types'
import { handleEthError } from '@/helpers'

export const useNftBookToken = (provider: UnrefProvider, address?: string) => {
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
