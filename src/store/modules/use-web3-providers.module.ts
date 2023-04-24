import { defineStore } from 'pinia'
import { useProvider, useWeb3 } from '@/composables'
import { DesignatedProvider } from '@/types'
import { PROVIDERS } from '@/enums'
import { ethers } from 'ethers'
import { config } from '@/config'

export const useWeb3ProvidersStore = defineStore('web3-providers-store', {
  state: () => ({
    providers: [] as DesignatedProvider[],
    provider: useProvider(),
  }),
  actions: {
    async detectProviders() {
      const web3 = useWeb3()
      await web3.init()
      this.providers = web3.providers.value
    },

    async init() {
      // temporary
      const metamaskProvider = this.providers.find(
        provider => provider.name === PROVIDERS.metamask,
      )

      if (metamaskProvider) await this.provider.init(metamaskProvider)

      if (!metamaskProvider || !this.provider.isConnected) {
        await this.setupFallbackProvider()
        return
      }
    },

    /* if user has no extension or mobile metamask app we are using 
      fallback provider to redirect him to app or to page where 
      he can download it */
    async setupFallbackProvider() {
      const metamaskFallBack: DesignatedProvider = {
        name: PROVIDERS.metamaskFallback,
        instance: new ethers.providers.JsonRpcProvider(config.DEFAULT_RPC_URL),
      }

      await this.provider.init(metamaskFallBack)
    },

    addProvider(provider: DesignatedProvider) {
      this.providers.push(provider)
    },
  },
})
