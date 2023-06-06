import { defineStore } from 'pinia'
import { UseProvider, useProvider, useWeb3 } from '@/composables'
import { ChainId, DesignatedProvider } from '@/types'
import { PROVIDERS } from '@/enums'
import { config } from '@/config'
import { getJsonRpcProvider } from '@/helpers'
import { useNetworksStore } from '@/store'

export const useWeb3ProvidersStore = defineStore('web3-providers-store', {
  state: () => ({
    providers: [] as DesignatedProvider[],
    _provider: useProvider(),
    fallbackProviders: new Map<ChainId, UseProvider>(),
  }),
  actions: {
    async detectProviders() {
      const web3 = useWeb3()
      await web3.init()
      this.providers = web3.providers.value
    },

    async init(chainList?: ChainId[]) {
      // temporary
      const metamaskProvider = this.providers.find(
        provider => provider.name === PROVIDERS.metamask,
      )

      if (metamaskProvider) await this._provider.init(metamaskProvider)

      await this.setupFallbackProviders(chainList)
    },

    /* 
      if user has no extension or mobile metamask app we are using 
      fallback provider to redirect him to app or to page where 
      he can download it
    */
    async setupFallbackProviders(
      chainList: ChainId[] = [Number(config.DEFAULT_CHAIN_ID)],
    ) {
      for (const chain of chainList) {
        const provider = useProvider()

        const fallbackInstance: DesignatedProvider = {
          name: PROVIDERS.metamaskFallback,
          instance: getJsonRpcProvider(chain),
        }

        await provider.init(fallbackInstance)

        this.fallbackProviders.set(chain, provider)
      }
    },

    addProvider(provider: DesignatedProvider) {
      this.providers.push(provider)
    },
  },
  getters: {
    /* 
      instance for interacting with contracts
      if user connected to invalid chain - we using fallback provider on
      default chain, otherwise --> regular provider
    */
    dynamicProvider: state => {
      const networkStore = useNetworksStore()

      const isValidChain = networkStore.list.some(
        i => Number(i.chain_id) === Number(state._provider.chainId),
      )
      const isConnected = state._provider.isConnected

      const providerInstance =
        isValidChain && isConnected
          ? state._provider
          : state.fallbackProviders.get(Number(config.DEFAULT_CHAIN_ID))

      return providerInstance as typeof state._provider
    },
    /*
      for basic needs in regular components
      if user has no providers or has provider, but didn't connect a wallet
      we using fallback provider on default chain
    */
    provider: state => {
      const isConnected = state._provider.isConnected

      const providerInstance =
        state._provider.selectedProvider && isConnected
          ? state._provider
          : state.fallbackProviders.get(Number(config.DEFAULT_CHAIN_ID))

      return providerInstance as typeof state._provider
    },
  },
})
