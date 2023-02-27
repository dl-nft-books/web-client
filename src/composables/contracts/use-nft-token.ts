import { ref, computed } from 'vue'
import { NftBookToken__factory } from '@/types'
import { EthProviderRpcError } from '@/types'
import { handleEthError, sleep } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

export const useNftBookToken = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentSigner &&
        !!contractAddress.value &&
        NftBookToken__factory.connect(
          contractAddress.value,
          provider.value.currentSigner,
        )) ||
      undefined,
  )

  const contractInterface = NftBookToken__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
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
      if (!contractInstance.value) return

      const tx = await contractInstance.value?.mintToken(
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

      return tx
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
      const data = contractInterface.encodeFunctionData('mintTokenByNFT', [
        nftAddress,
        nftFloorPrice,
        tokenId,
        endTimestamp,
        tokenURI,
        r,
        s,
        v,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getMinNFTFloorPrice = async () => {
    if (!contractInstance.value) return

    return contractInstance.value.minNFTFloorPrice()
  }

  const getUserTokenIDs = (address: string) => {
    if (!contractInstance.value) return

    return contractInstance.value.getUserTokenIDs(address)
  }

  return {
    init,
    mintToken,
    mintTokenByNFT,
    getMinNFTFloorPrice,
    getUserTokenIDs,
  }
}
