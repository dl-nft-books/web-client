import { computed } from 'vue'

import {
  createCheckoutOperation,
  EVMOperation,
  Price,
  PaymentToken,
  CheckoutOperation,
  SwapEstimation,
  BridgeChain,
} from '@rarimo/nft-checkout'

import { createProvider } from '@rarimo/provider'
import { MetamaskProvider } from '@rarimo/providers-evm'

import { utils } from 'ethers'

import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { useContractRegistry } from '@/composables'
import { MarketPlace__factory, BuyParams, Signature } from '@/types'

export function useNftCheckout(contractRegistryAddress?: string) {
  const networkStore = useNetworksStore()
  const web3ProvidersStore = useWeb3ProvidersStore()

  /* 
     nft checkout always performing on wrong chain thats why we need fallback

     for now destination chain is basically determined by config.DEFAULT_CHAIN 
     and can be only one
     
     If future needs will require choosing destination chain --> fallback 
     provider will be extended to Map<ChainId, UseProvider> and needed fallback
     will be pick respectively
  */
  const provider = computed(() => web3ProvidersStore.fallbackProvider)

  let marketPlaceAddress = ''
  let checkout: CheckoutOperation | undefined = undefined

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry(
    provider,
    contractRegistryAddress,
  )

  const _initContractRegistry = async (chainId: number) => {
    const appropriateRegistryAddress = networkStore.getRegistryAddress(chainId)

    initRegistry(appropriateRegistryAddress)
  }

  const _initMarketPlace = async () => {
    const address = await getMarketPlaceAddress()

    if (!address) return

    marketPlaceAddress = address
  }

  const getSupportedChains = () => {
    return checkout && checkout.getSupportedChains()
  }

  const getSupportedTokens = () => {
    return checkout && checkout.getPaymentTokens()
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
    if (!checkout) return

    const resp = await checkout.estimatePrice([paymentToken])

    return resp[0]
  }

  const performCheckout = async (
    estimatedPrice: SwapEstimation,
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

    const txHash = await checkout.checkout([estimatedPrice], { bundle })

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
