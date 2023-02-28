import { defineStore } from 'pinia'
import { useProvider, useWeb3 } from '@/composables'
import { DesignatedProvider } from '@/types'
import { PROVIDERS } from '@/enums'

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
      const metamaskFallBack: DesignatedProvider = {
        name: PROVIDERS.metamaskFallback,
        instance: undefined,
      }

      this.addProvider(metamaskFallBack)

      // temporary
      const metamaskProvider = this.providers.find(
        provider => provider.name === PROVIDERS.metamask,
      )

      if (metamaskProvider) {
        await this.provider.init(metamaskProvider)
      } else {
        /* if user has no extension or mobile metamask app we are using 
           fallback provider to redirect him to app or to page where 
           he can download it */
        const fallbackProvider = this.providers.find(
          provider => provider.name === PROVIDERS.metamaskFallback,
        )

        if (fallbackProvider) await this.provider.init(fallbackProvider)
      }
    },

    addProvider(provider: DesignatedProvider) {
      this.providers.push(provider)
    },
  },
})
