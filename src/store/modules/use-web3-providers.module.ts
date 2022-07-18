import { defineStore } from 'pinia'
import { useWeb3 } from '@/composables'

export const useWeb3ProvidersStore = defineStore('web3-providers-store', {
  state: () => ({
    providers: [] as any[],
  }),
  actions: {
    async detectProviders() {
      const web3 = useWeb3()
      await web3.init()
      this.providers = web3.providers.value
    },
    addProvider(provider: any) {
      this.providers.push(provider)
    },
  },
})
