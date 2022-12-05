import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { WINDOW_BREAKPOINTS } from '@/enums'

export const useMetaMaskConnect = () => {
  const { provider } = storeToRefs(useWeb3ProvidersStore())
  const APP_URL = `https://metamask.app.link/dapp/${window.location.host}`

  const redirect = () => {
    try {
      window.open(APP_URL)
    } catch (error) {
      window.location.reload()
    }
  }

  const handleMobileVersion = () => {
    if (navigator.userAgent.includes('MetaMask')) {
      provider.value.connect()
      return
    }

    redirect()
  }

  const connect = () => {
    if (window.innerWidth <= WINDOW_BREAKPOINTS.medium) {
      handleMobileVersion()
      return
    }

    provider.value.connect()
  }

  return {
    connect,
  }
}
