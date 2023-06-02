import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { computed, ref } from 'vue'
import { ContractRegistry__factory, EthProviderRpcError } from '@/types'
import { handleEthError, getJsonRpcProvider } from '@/helpers'
import { config } from '@/config'

export const useContractRegistry = (address?: string) => {
  const networkStore = useNetworksStore()
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const isValidChain = computed(() =>
    networkStore.list.some(
      i => Number(i.chain_id) === Number(provider.value.chainId),
    ),
  )

  const contractAddress = ref(address || '')

  const rpcProvider = computed(() =>
    getJsonRpcProvider(
      isValidChain.value
        ? provider.value.chainId?.toString()
        : config.DEFAULT_CHAIN_ID,
    ),
  )

  // for read operations always using RPC
  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        ContractRegistry__factory.connect(
          contractAddress.value,
          rpcProvider.value,
        )) ||
      undefined,
  )

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const getMarketPlaceAddress = async () => {
    try {
      if (!contractInstance.value) return

      const data = await contractInstance.value.getMarketplaceContract()

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    getMarketPlaceAddress,
  }
}
