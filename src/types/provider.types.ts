import { useWeb3ProvidersStore } from '@/store'
import { FALLBACK_PROVIDERS } from '@/enums'
import { PROVIDERS } from '@distributedlab/w3p'
import { useProvider } from '@/composables'

export type UnwrappedProvider = ReturnType<
  typeof useWeb3ProvidersStore
>['provider']

export type UseProvider = ReturnType<typeof useProvider>

export type SUPPORTED_PROVIDERS = PROVIDERS | FALLBACK_PROVIDERS
