import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useProvider } from '@/composables'
import { config } from '@/config'
import { getJsonRpcProvider } from '@/helpers'
import { useNetworksStore } from '@/store'

import {
  ProviderDetector,
  PROVIDERS,
  MetamaskProvider,
  RawProvider,
  FallbackEvmProvider,
} from '@distributedlab/w3p'
import { router } from '@/router'
import { CURRENCIES, FALLBACK_PROVIDERS, Q_CHAINS } from '@/enums'
import { SUPPORTED_PROVIDERS } from '@/types'

class MetamaskFallbackProvider extends FallbackEvmProvider {
  constructor(rawProvider: RawProvider) {
    super(rawProvider)
  }

  static get providerType() {
    return FALLBACK_PROVIDERS.MetamaskFallback
  }

  async connect(): Promise<void> {
    try {
      const METAMASK_APP_CONNECT_URL = `https://metamask.app.link/dapp/${window.location.host}${router.currentRoute.value.fullPath}`

      window.open(METAMASK_APP_CONNECT_URL)
    } catch (error) {
      window.location.reload()
    }
  }
}

const STORE_NAME = 'web3-providers-store'

export const useWeb3ProvidersStore = defineStore(STORE_NAME, () => {
  const networkStore = useNetworksStore()

  const provider = useProvider()
  const fallbackProvider = useProvider()

  const providerDetector = computed(
    () => new ProviderDetector<SUPPORTED_PROVIDERS>(),
  )
  const isValidChain = computed(() =>
    networkStore.list.some(
      i => Number(i.chain_id) === Number(provider.chainId?.value),
    ),
  )

  /*
      Temporary solution. We need to display Q as a currency only for Q Chains.
  */
  const chainCurrency = computed(() =>
    [Q_CHAINS.mainet, Q_CHAINS.testnet].includes(
      provider.chainId?.value?.toString() as Q_CHAINS,
    ) &&
    networkStore.list.some(
      network =>
        network.chain_id.toString() === provider.chainId?.value?.toString(),
    )
      ? CURRENCIES.Q
      : CURRENCIES.USD,
  )

  async function detectProviders() {
    await providerDetector.value.init()
  }

  async function setupFallback() {
    providerDetector.value.addProvider({
      name: FALLBACK_PROVIDERS.MetamaskFallback,
      instance: getJsonRpcProvider(
        Number(config.DEFAULT_CHAIN_ID),
      ) as unknown as RawProvider,
    })

    await fallbackProvider.init(MetamaskFallbackProvider, {
      providerDetector: providerDetector.value,
    })
  }

  async function init() {
    // setuping fallback to be able to use it when its needed
    await setupFallback()

    const metamaskProvider = providerDetector.value.getProvider(
      PROVIDERS.Metamask,
    )

    // if metamask provider is present --> init it
    if (metamaskProvider) {
      await provider.init(MetamaskProvider, {
        providerDetector: providerDetector.value,
      })
      return
    }

    // if no metamask provider found --> fallback is main provider
    await provider.init(MetamaskFallbackProvider, {
      providerDetector: providerDetector.value,
    })
  }

  return {
    detectProviders,
    init,

    provider,
    fallbackProvider,
    isValidChain,
    chainCurrency,
  }
})
