import { computed, ref } from 'vue'

import {
  createCheckoutOperation,
  EVMOperation,
  Price,
  PaymentToken,
  INFTCheckoutOperation,
  EstimatedPrice,
  BridgeChain,
  Target,
} from '@rarimo/nft-checkout'

import { createProvider } from '@rarimo/provider'
import { MetamaskProvider } from '@rarimo/providers-evm'

import { utils } from 'ethers'

import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { BuyParams, Signature, useContractRegistry } from '@/composables'
// import { ETHEREUM_CHAINS, POLYGON_CHAINS, Q_CHAINS } from '@/enums'
import { MarketPlace__factory } from '@/types'

// type Chain = ETHEREUM_CHAINS | POLYGON_CHAINS | Q_CHAINS

export function useNftCheckout(contractRegistryAddress?: string) {
  const web3Store = useWeb3ProvidersStore()
  const networkStore = useNetworksStore()

  const provider = computed(() => web3Store.provider)
  const marketPlaceAddress = ref('')

  let checkout: INFTCheckoutOperation | undefined = undefined

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry(
    contractRegistryAddress,
  )

  const _initContractRegistry = async (chainId: number) => {
    if (!networkStore.list.length) {
      await networkStore.loadNetworks()
    }

    const appropriateRegistryAddress = networkStore.list.find(
      network => network.chain_id === chainId,
    )?.factory_address

    if (!appropriateRegistryAddress)
      throw new Error('failed to get registry address')

    initRegistry(appropriateRegistryAddress)
  }

  const _initMarketPlace = async () => {
    const address = await getMarketPlaceAddress()

    if (!address) return

    marketPlaceAddress.value = address
  }

  // const _convertChain = (chain: Chain): ChainNames => {
  //   switch (chain) {
  //     case ETHEREUM_CHAINS.ethereum:
  //       return ChainNames.Ethereum
  //     case ETHEREUM_CHAINS.goerli:
  //       return ChainNames.Goerli
  //     case ETHEREUM_CHAINS.sepolia:
  //       return ChainNames.Sepolia
  //     case POLYGON_CHAINS.mainnet:
  //       return ChainNames.Polygon
  //     default:
  //     case POLYGON_CHAINS.mumbai:
  //       return ChainNames.Mumbai
  //   }
  // }

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

    const target: Target = {
      chainId: destinationChain.id,
      recipient: opts.recipient,
      price: Price.fromBigInt(opts.nftPrice, 18, sourceChain.token.symbol),
      swapTargetTokenSymbol: 'GETH',
    }

    await checkout.init({
      chainIdFrom: sourceChain.id,
      target,
    })
  }

  const createCheckout = async () => {
    if (!provider.value.chainId) return

    await _initContractRegistry(Number(provider.value.chainId))
    await _initMarketPlace()

    const providerInstance = await createProvider(MetamaskProvider)

    checkout = createCheckoutOperation(EVMOperation, providerInstance)
  }

  const getEstimatedPrice = async (paymentToken: PaymentToken) => {
    return checkout && checkout.estimatePrice(paymentToken)
  }

  const sendTransaction = async (
    estimatedPrice: EstimatedPrice,
    txOpts: {
      buyParams: BuyParams
      signature: Signature
      amountOfEth: string
    },
  ) => {
    if (!checkout) return

    if (!marketPlaceAddress.value) throw new Error('no marketplace address')

    const marketplaceInterface = MarketPlace__factory.createInterface()

    const encodedFunctionData = marketplaceInterface.encodeFunctionData(
      'buyTokenWithETH',
      [txOpts.buyParams, txOpts.signature],
    )

    const bundle = utils.defaultAbiCoder.encode(
      ['address[]', 'uint256[]', 'bytes[]'],
      [
        [marketPlaceAddress.value],
        [txOpts.buyParams.paymentDetails.paymentTokenPrice],
        [encodedFunctionData],
      ],
    )

    const txHash = await checkout.checkout(estimatedPrice, { bundle })

    return txHash
  }

  return {
    checkout,
    createCheckout,
    initCheckout,
    sendTransaction,
    getEstimatedPrice,
    getSupportedChains,
    getSupportedTokens,
  }
}
