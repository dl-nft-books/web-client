import { ref } from 'vue'
import { router } from '@/router'
import { ProviderWrapper } from '@/types'

export function useMetamaskFallback(): Pick<
  ProviderWrapper,
  'connect' | 'init'
> {
  const MetamaskAppConnectUrl = ref('')

  const init = async () => {
    MetamaskAppConnectUrl.value = `https://metamask.app.link/dapp/${window.location.host}${router.currentRoute.value.fullPath}`
  }

  const connect = async () => {
    try {
      window.open(MetamaskAppConnectUrl.value)
    } catch (error) {
      window.location.reload()
    }
  }

  return {
    init,
    connect,
  }
}
