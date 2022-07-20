import {
  PhantomProvider,
  ProviderInstance,
  ProviderWrapper,
  SolProviderRpcError,
  TxRequestBody,
} from '@/types'
import { computed, ref } from 'vue'
import { handleSolError } from '@/helpers'
import {
  Connection,
  clusterApiUrl,
  Cluster,
  Transaction as SolTransaction,
  PublicKey,
} from '@solana/web3.js'

export const usePhantom = (provider: ProviderInstance): ProviderWrapper => {
  const currentProvider = provider as PhantomProvider

  const chainId = ref<number | string>('devnet') // TODO: create chains enum (maybe)
  const selectedAddress = ref('')

  const connection = ref(
    new Connection(clusterApiUrl(chainId.value as Cluster)),
  )

  const isConnected = computed(() =>
    Boolean(selectedAddress.value && chainId.value),
  )
  const init = async () => {
    _setListeners()
    await _updateProviderState()
  }

  const _setListeners = () => {
    currentProvider.on('connect', () => {
      _updateProviderState()
    })
    currentProvider.on('disconnect', () => {
      _updateProviderState()
    })
    currentProvider.on('accountChanged', () => {
      _updateProviderState()
    })
  }

  const _updateProviderState = async () => {
    const publicKey = currentProvider.publicKey
    selectedAddress.value = publicKey ? new PublicKey(publicKey).toBase58() : ''
  }

  const connect = async () => {
    try {
      await currentProvider.connect()
    } catch (error) {
      handleSolError(error as SolProviderRpcError)
    }
  }

  const switchChain = async (_chainId: string | number) => {
    try {
      connection.value = new Connection(clusterApiUrl(chainId.value as Cluster))
      chainId.value = _chainId
    } catch (error) {
      handleSolError(error as SolProviderRpcError)
    }
  }

  const signAndSendTransaction = async (txRequestBody: TxRequestBody) => {
    try {
      const { signature } = await currentProvider.signAndSendTransaction(
        txRequestBody as SolTransaction,
      )
      await connection.value.confirmTransaction(signature)
      return signature
    } catch (error) {
      handleSolError(error as SolProviderRpcError)
    }
  }

  return {
    chainId,
    isConnected,
    selectedAddress,

    init,
    connect,
    switchChain,
    signAndSendTransaction,
  }
}
