import { config } from '@/config'
import { router } from '@/router'
import { ChainId, ProviderWrapper } from '@/types'
import { ethers } from 'ethers'
import { computed, ref } from 'vue'

export function useMetamaskFallback(): Pick<
  ProviderWrapper,
  'connect' | 'init' | 'defaultProvider' | 'chainId'
> {
  const chainId = ref<ChainId>('')

  const defaultProvider = computed(
    () => new ethers.providers.JsonRpcProvider(config.DEFAULT_RPC_URL),
  )

  const init = async () => {
    chainId.value = config.DEFAULT_CHAIN_ID
  }

  const connect = async () => {
    try {
      const METAMASK_APP_CONNECT_URL = `https://metamask.app.link/dapp/${window.location.host}${router.currentRoute.value.fullPath}`

      window.open(METAMASK_APP_CONNECT_URL)
    } catch (error) {
      window.location.reload()
    }
  }

  return {
    init,
    connect,
    defaultProvider,
    chainId,
  }
}
