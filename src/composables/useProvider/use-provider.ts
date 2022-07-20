import { PROVIDERS } from '@/enums'
import { computed, ComputedRef, ref } from 'vue'
import {
  useMetamask,
  useCoinbase,
  usePhantom,
  useSolflare,
} from '@/composables/useProvider'
import { DesignatedProvider, ProviderWrapper, TxRequestBody } from '@/types'
import { ProviderWrapperMethodNotFoundError } from '@/errors'

export const useProvider = () => {
  const providerWrp = ref<ProviderWrapper | undefined>()

  const selectedProvider = ref()
  const chainId: ComputedRef<string | number | undefined> = computed(
    () => providerWrp.value?.chainId as string | number | undefined,
  )
  const selectedAddress: ComputedRef<string | undefined> = computed(
    () => providerWrp.value?.selectedAddress as string | undefined,
  )
  const isConnected = computed(() =>
    Boolean(chainId.value && selectedAddress.value),
  )

  const init = async (provider: DesignatedProvider) => {
    switch (provider.name as PROVIDERS) {
      case PROVIDERS.metamask:
        providerWrp.value = useMetamask(provider.instance)
        break
      case PROVIDERS.coinbase:
        providerWrp.value = useCoinbase(provider.instance)
        break
      case PROVIDERS.phantom:
        providerWrp.value = usePhantom(provider.instance)
        break
      case PROVIDERS.solflare:
        providerWrp.value = useSolflare(provider.instance)
        break
      default:
        throw new Error('Invalid Provider')
    }
    selectedProvider.value = provider.name
    await providerWrp.value.init()
  }

  const connect = async () => {
    if (!providerWrp.value) throw new ProviderWrapperMethodNotFoundError()

    await providerWrp.value.connect()
  }

  const switchChain = async (chainId: string | number) => {
    if (!providerWrp.value) throw new ProviderWrapperMethodNotFoundError()

    await providerWrp.value.switchChain(chainId)
  }

  const addChain = async (
    chainId: string | number,
    chainName: string,
    chainRpcUrl: string,
  ) => {
    if (!providerWrp.value || !providerWrp.value?.addChain)
      throw new ProviderWrapperMethodNotFoundError()

    await providerWrp.value.addChain(chainId, chainName, chainRpcUrl)
  }

  const disconnect = () => {
    providerWrp.value = undefined
  }

  const signAndSendTx = async (txRequestBody: TxRequestBody) => {
    if (!providerWrp.value) throw new ProviderWrapperMethodNotFoundError()

    await providerWrp.value.signAndSendTransaction(txRequestBody)
  }

  return {
    selectedProvider,
    chainId,
    selectedAddress,
    isConnected,

    init,
    connect,
    switchChain,
    addChain,
    disconnect,
    signAndSendTx,
  }
}
