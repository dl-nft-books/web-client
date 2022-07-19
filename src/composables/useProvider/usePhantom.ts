import {
  ProviderInstance,
  ProviderWrapper,
  SolProviderRpcError,
  TxRequestBody,
} from '@/types'
import { computed, ref } from 'vue'
import { handleSolError } from '@/helpers/solana.helpers'
import {
  Connection,
  clusterApiUrl,
  Cluster,
  Transaction as SolTransaction,
  Keypair,
} from '@solana/web3.js'

export const usePhantom = (provider: ProviderInstance): ProviderWrapper => {
  const chainId = ref<number | string>('devnet') // TODO: create chains enum (maybe)
  const selectedAddress = ref('')

  const connection = ref(
    new Connection(clusterApiUrl(chainId.value) as Cluster),
  )

  const isConnected = computed(() =>
    Boolean(selectedAddress.value && chainId.value),
  )
  const init = async () => {
    _setListeners()
    await _updateProviderState()
  }

  const _setListeners = () => {
    provider.on('connect', () => {
      _updateProviderState()
    })
    provider.on('disconnect', () => {
      _updateProviderState()
    })
  }

  const _updateProviderState = async () => {
    const publicKey = provider.publicKey
    selectedAddress.value = publicKey ? provider.publicKey.toBase58() : ''
  }

  const connect = async () => {
    try {
      await provider.connect()
    } catch (error) {
      handleSolError(error as SolProviderRpcError)
    }
  }

  const switchChain = async (_chainId: string | number) => {
    try {
      connection.value = new Connection(clusterApiUrl(chainId) as Cluster)
      chainId.value = _chainId
    } catch (error) {
      handleSolError(error as SolProviderRpcError)
    }
  }

  const addChain = async (
    chainId: string | number,
    chainName: string,
    chainRpcUrl: string,
  ) => {
    // eslint-disable-next-line no-empty
    try {
    } catch (error) {
      handleSolError(error as SolProviderRpcError)
    }
  }

  const signAndSendTransaction = async (txRequestBody: TxRequestBody) => {
    try {
      console.log('here')
      const { signature } = await provider.signAndSendTransaction(
        txRequestBody as SolTransaction,
      )
      console.log('here 1')
      await connection.value.confirmTransaction(signature)
      console.log('here 2')
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
    addChain,
    signAndSendTransaction,
  }
}
