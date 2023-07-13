import { ref, computed, Ref } from 'vue'
import {
  Erc721__factory,
  EthProviderRpcError,
  UnwrappedProvider,
} from '@/types'
import { handleEthError, sleep } from '@/helpers'

export const useErc721 = (
  provider: Ref<UnwrappedProvider>,
  address?: string,
) => {
  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        Erc721__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  const contractInterface = Erc721__factory.createInterface()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const approve = async (spender: string, tokenId: string) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('approve', [
        spender,
        tokenId,
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

  const getBalanceOf = async (address: string) => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.balanceOf(address)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getOwner = async (tokenId: string) => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.ownerOf(tokenId)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getName = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.name()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getSymbol = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.symbol()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const tokenURI = async (tokenId: string) => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value.tokenURI(tokenId)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,

    approve,
    getBalanceOf,

    getName,
    getOwner,
    getSymbol,
    tokenURI,
  }
}
