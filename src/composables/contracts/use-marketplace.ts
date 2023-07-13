import { UnwrappedProvider } from '@/types'
import { Ref, computed, ref } from 'vue'
import {
  MarketPlace__factory,
  EthProviderRpcError,
  BuyParams,
  Signature,
} from '@/types'
import { handleEthError } from '@/helpers'

export const useMarketplace = (
  provider: Ref<UnwrappedProvider>,
  address?: string,
) => {
  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        MarketPlace__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
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

      const data = await contractInstance.value.getDetailedTokenInfo(
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

      const data = await contractInstance.value.getBriefTokenInfoPart(
        offset,
        limit,
      )

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const buyTokenWithETH = async (
    buyParams: BuyParams,
    signature: Signature,
    value?: string,
  ) => {
    if (!contractInstance.value) return

    try {
      const data = contractInterface.encodeFunctionData('buyTokenWithETH', [
        buyParams,
        signature,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
        ...(value ? { value } : {}),
      })

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const buyTokenWithERC20 = async (
    buyParams: BuyParams,
    signature: Signature,
  ) => {
    try {
      const data = contractInterface.encodeFunctionData('buyTokenWithERC20', [
        buyParams,
        signature,
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

  const buyTokenWithNFT = async (
    buyParams: BuyParams,
    signature: Signature,
  ) => {
    try {
      const data = contractInterface.encodeFunctionData('buyTokenWithNFT', [
        buyParams,
        signature,
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

  const getUserTokens = async (
    userAddress: string,
    limit: number,
    offset: number,
  ) => {
    if (!contractInstance.value) return

    try {
      const data = await contractInstance.value.getUserTokensPart(
        userAddress,
        offset,
        limit,
      )

      return data
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
    buyTokenWithERC20,
    buyTokenWithETH,
    buyTokenWithNFT,
    getUserTokens,
  }
}
