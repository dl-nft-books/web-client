import { config } from '@/config'
import {
  ErrorHandler,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
} from '@/helpers'
import { router } from '@/router'
import {
  ChainId,
  EthTransactionResponse,
  ProviderInstance,
  ProviderWrapper,
  TransactionResponse,
} from '@/types'
import { ethers } from 'ethers'
import { computed, ref } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { PROVIDERS } from '@/enums'

export function useMetamaskFallback(
  provider: ProviderInstance,
): ProviderWrapper {
  const web3Store = useWeb3ProvidersStore()

  const chainId = ref<ChainId>('')
  const selectedAddress = ref('')

  const currentProvider = computed(
    () => provider as ethers.providers.Web3Provider,
  )

  const isConnected = computed(() => true)

  const _redirect = () => {
    try {
      const METAMASK_APP_CONNECT_URL = `https://metamask.app.link/dapp/${window.location.host}${router.currentRoute.value.fullPath}`

      window.open(METAMASK_APP_CONNECT_URL)
    } catch (error) {
      window.location.reload()
    }
  }

  const init = async () => {
    chainId.value = config.DEFAULT_CHAIN_ID
  }

  const connect = async () => {
    const metamaskProvider = web3Store.providers.find(
      provider => provider.name === PROVIDERS.metamask,
    )

    if (!metamaskProvider) {
      _redirect()
      return
    }

    try {
      await web3Store.provider.init(metamaskProvider)
      await web3Store.provider.connect()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const switchChain = async (_chainId: ChainId) => {
    chainId.value = _chainId
  }

  const getTxUrl = (explorerUrl: string, txHash: string) => {
    return getEthExplorerTxUrl(explorerUrl, txHash)
  }

  const getAddressUrl = (explorerUrl: string, address: string) => {
    return getEthExplorerAddressUrl(explorerUrl, address)
  }

  const getHashFromTxResponse = (txResponse: TransactionResponse) => {
    const transactionResponse = txResponse as EthTransactionResponse

    return transactionResponse.hash
  }
  return {
    currentProvider,

    chainId,
    selectedAddress,
    isConnected,

    init,
    connect,
    switchChain,
    getTxUrl,
    getAddressUrl,
    getHashFromTxResponse,
  }
}
