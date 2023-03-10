import { router } from '@/router'
import { ProviderWrapper } from '@/types'

export function useMetamaskFallback(): Pick<
  ProviderWrapper,
  'connect' | 'init'
> {
  const init = async () => {
    return
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
  }
}
