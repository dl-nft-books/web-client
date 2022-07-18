import { computed, ref } from 'vue'
import { sleep } from '@/helpers'
import { PROVIDERS, PROVIDERS_CHECKS } from '@/enums'

export const useWeb3 = () => {
  const providers = ref<any[]>([])

  const _browserProviders = ref<any[]>([])

  const isEnabled = computed(() => providers.value.length)

  const init = async () => {
    await sleep(500)
    detectProvidersInBrowser()
    await _defineProviders()
  }

  const detectProvidersInBrowser = () => {
    const ethProviders = window?.ethereum
      ? window?.ethereum?.providers || [window?.ethereum]
      : undefined
    const phantomProvider = window?.solana
    const solflareProvider = window?.solflare

    _browserProviders.value = [
      ...(ethProviders ? ethProviders : []),
      ...(phantomProvider ? [phantomProvider] : []),
      ...(solflareProvider ? [solflareProvider] : []),
    ]
  }

  const _defineProviders = async () => {
    if (_browserProviders.value.length) {
      await handleProviders()
    } else {
      await sleep(3000)
      await handleProviders()
    }

    async function handleProviders() {
      if (!_browserProviders.value.length) return
      providers.value = designateBrowserProviders()
    }
  }

  const designateBrowserProviders = (): any[] => {
    if (!_browserProviders.value.length) return []

    const designatedProviders = _browserProviders.value.map(el => {
      const appropriatedProviderName = getAppropriateProviderName(el)

      return {
        name: appropriatedProviderName,
        provider: el,
      }
    })

    return designatedProviders.filter(
      (el, idx, arr) => arr.findIndex(sec => sec.name === el.name) === idx,
    )
  }

  const getAppropriateProviderName = (provider: any) => {
    const providerName = Object.entries(PROVIDERS_CHECKS).find(el => {
      const [_, value] = el

      return provider[value] as keyof typeof PROVIDERS
    })

    return (providerName && providerName[0]) || PROVIDERS.fallback
  }

  return {
    providers,

    isEnabled,

    init,
  }
}
