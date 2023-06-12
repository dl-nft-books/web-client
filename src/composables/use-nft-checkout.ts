import { ref } from 'vue'

import {
  createCheckoutOperation,
  EVMOperation,
  Price,
  PaymentToken,
  CheckoutOperation,
  EstimatedPrice,
  BridgeChain,
} from '@rarimo/nft-checkout'

import { createProvider } from '@rarimo/provider'
import { MetamaskProvider } from '@rarimo/providers-evm'

import { utils } from 'ethers'

import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { BuyParams, Signature, useContractRegistry } from '@/composables'
import { MarketPlace__factory, UnwrappedProvider } from '@/types'
import { config } from '@/config'

export function useNftCheckout(contractRegistryAddress?: string) {
  const networkStore = useNetworksStore()
  const web3ProvidersStore = useWeb3ProvidersStore()

  const provider = ref<UnwrappedProvider>()

  let marketPlaceAddress = ''
  let checkout: CheckoutOperation | undefined = undefined

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry(
    contractRegistryAddress,
    provider,
  )

  const _initProvider = (chainId: number) => {
    const providerInstance = web3ProvidersStore.fallbackProviders.get(chainId)

    if (!providerInstance) throw new Error('no provider found for this chain')

    provider.value = providerInstance as unknown as UnwrappedProvider
  }

  const _initContractRegistry = async (chainId: number) => {
    if (!networkStore.list.length) {
      await networkStore.loadNetworks()
    }

    const appropriateRegistryAddress = networkStore.list.find(
      network => network.chain_id === chainId,
    )?.factory_address

    // in case we don't have registry on that chain - we use default one
    if (!appropriateRegistryAddress) {
      const defaultRegistryAddress = networkStore.list.find(
        network => network.chain_id === Number(config.DEFAULT_CHAIN_ID),
      )?.factory_address

      if (!defaultRegistryAddress)
        throw new Error('failed to get default registry address')

      initRegistry(defaultRegistryAddress)
      return
    }

    initRegistry(appropriateRegistryAddress)
  }

  const _initMarketPlace = async () => {
    const address = await getMarketPlaceAddress()

    if (!address) return

    marketPlaceAddress = address
  }

  const getSupportedChains = () => {
    return checkout && checkout.supportedChains()
  }

  const getSupportedTokens = (chain: BridgeChain) => {
    return checkout && checkout.loadPaymentTokens(chain)
  }

  const initCheckout = async (
    sourceChain: BridgeChain,
    destinationChain: BridgeChain,
    opts: {
      recipient: string
      nftPrice: string
    },
  ) => {
    if (!checkout) return

    _initProvider(Number(destinationChain.id))
    await _initContractRegistry(Number(destinationChain.id))
    await _initMarketPlace()

    await checkout.init({
      chainIdFrom: sourceChain.id,
      chainIdTo: destinationChain.id,
      recipient: opts.recipient,
      price: Price.fromBigInt(opts.nftPrice, 18, destinationChain.token.symbol),
    })
  }

  const createCheckout = async () => {
    const providerInstance = await createProvider(MetamaskProvider)

    checkout = createCheckoutOperation(EVMOperation, providerInstance)
  }

  const getEstimatedPrice = async (paymentToken: PaymentToken) => {
    return checkout && checkout.estimatePrice(paymentToken)
  }

  const performCheckout = async (
    estimatedPrice: EstimatedPrice,
    txOpts: {
      buyParams: BuyParams
      signature: Signature
      amountOfEth: string
    },
  ) => {
    if (!checkout) return

    if (!marketPlaceAddress) throw new Error('no marketplace address')

    const marketplaceInterface = MarketPlace__factory.createInterface()

    const encodedFunctionData = marketplaceInterface.encodeFunctionData(
      'buyTokenWithETH',
      [txOpts.buyParams, txOpts.signature],
    )

    const bundle = utils.defaultAbiCoder.encode(
      ['address[]', 'uint256[]', 'bytes[]'],
      [[marketPlaceAddress], [txOpts.amountOfEth], [encodedFunctionData]],
    )

    const txHash = await checkout.checkout(estimatedPrice, { bundle })

    return txHash
  }

  return {
    checkout,
    createCheckout,
    initCheckout,
    performCheckout,
    getEstimatedPrice,
    getSupportedChains,
    getSupportedTokens,
  }
}
