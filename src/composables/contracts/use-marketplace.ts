import { useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import { MarketPlace__factory, EthProviderRpcError } from '@/types'
import { handleEthError } from '@/helpers'

export type TokenParams = {
  pricePerOneToken: string
  minNFTFloorPrice: string
  voucherTokensAmount: string
  voucherTokenContract: string
  fundsRecipient: string
  isNFTBuyable: boolean
  isDisabled: boolean
}

export const useMarketplace = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentSigner &&
        !!contractAddress.value &&
        MarketPlace__factory.connect(
          contractAddress.value,
          provider.value.currentSigner,
        )) ||
      (!!provider.value.defaultProvider &&
        !!contractAddress.value &&
        MarketPlace__factory.connect(
          contractAddress.value,
          provider.value.defaultProvider,
        )) ||
      undefined,
  )

  const contractInterface = MarketPlace__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const getTokenParams = async (tokenContracts: string[]) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getDetailedTokenParams(
        tokenContracts,
      )

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getTokenContractsCount = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getActiveTokenContractsCount()

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getBooksContracts = async (limit: number, offset: number) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getTokenContractsPart(
        offset,
        limit,
      )

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getBooksBatch = async (limit: number, offset: number) => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getBaseTokenParamsPart(
        offset,
        limit,
      )

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const mintToken = async (
    tokenAddress: string,
    tokenId: string,
    paymentTokenAddress: string,
    paymentTokenPrice: string,
    discount: string,
    endTimestamp: number,
    tokenURI: string,
    r: string,
    s: string,
    v: number,
    value?: string,
  ) => {
    try {
      if (!contractInstance.value) return

      const tx = await contractInstance.value.buyToken(
        tokenAddress,
        tokenId,
        paymentTokenAddress,
        paymentTokenPrice,
        discount,
        endTimestamp,
        tokenURI,
        r,
        s,
        v,
        ...(value ? [{ value }] : []),
      )

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const mintTokenByNFT = async (
    tokenAddress: string,
    tokenId: string,
    nftAddress: string,
    nftFloorPrice: string,
    nftId: string,
    endTimestamp: number,
    tokenURI: string,
    r: string,
    s: string,
    v: number,
  ) => {
    try {
      const data = contractInterface.encodeFunctionData('buyTokenByNFT', [
        tokenAddress,
        tokenId,
        nftAddress,
        nftFloorPrice,
        nftId,
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

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    getTokenParams,
    getTokenContractsCount,
    getBooksContracts,
    getBooksBatch,
    mintToken,
    mintTokenByNFT,
  }
}
