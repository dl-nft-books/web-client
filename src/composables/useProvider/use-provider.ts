import { PROVIDERS } from '@/enums'
import { computed, ref } from 'vue'
import { useMetamask } from './use-metamask'
import { useCoinbase } from './use-coinbase'
import { DesignatedProvider, TxRequestBody } from '@/types'

export const useProvider = () => {
  const providerWrp = ref()

  const selectedProvider = ref()
  const chainId = computed(() => providerWrp.value?.chainId)
  const selectedAddress = computed(() => providerWrp.value?.selectedAddress)
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
      default:
        throw new Error('Invalid Provider')
    }
    selectedProvider.value = provider.name
    await providerWrp.value.init()
  }

  const connect = async () => {
    await providerWrp.value.connect()
  }

  const switchChain = async (chainId: string | number) => {
    await providerWrp.value.switchChain(chainId)
  }

  const addChain = async (
    chainId: string | number,
    chainName: string,
    chainRpcUrl: string,
  ) => {
    await providerWrp.value.addChain(chainId, chainName, chainRpcUrl)
  }

  const disconnect = () => {
    providerWrp.value = undefined
  }

  const signAndSendTx = async (txRequestBody: TxRequestBody) => {
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
