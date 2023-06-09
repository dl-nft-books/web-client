import { useWeb3ProvidersStore } from '@/store'
import { computed, ref, Ref } from 'vue'
import {
  ContractRegistry__factory,
  EthProviderRpcError,
  UnwrappedProvider,
} from '@/types'
import { handleEthError } from '@/helpers'

export const useContractRegistry = (
  address?: string,
  providerInstance?: Ref<UnwrappedProvider | undefined>,
) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(
    () => providerInstance?.value ?? web3ProvidersStore.dynamicProvider,
  )

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        ContractRegistry__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
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
