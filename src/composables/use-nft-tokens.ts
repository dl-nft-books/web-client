import {
  useMarketplace,
  useContractRegistry,
  useErc721,
  BuyParams,
  Signature,
} from '@/composables'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { IMarketplace } from '@/types/contracts/MarketPlace'
import { BN } from '@/utils/math.util'
import { computed, watch } from 'vue'

export type TokenBaseInfo = {
  tokenContract: string
  tokenIds: Array<string>
}

export function useNftTokens() {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()

  const provider = computed(() => web3Store.provider)

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry()
  const {
    getUserTokens,
    init: initMarketPlace,
    buyTokenWithERC20,
    buyTokenWithETH,
    buyTokenWithNFT,
  } = useMarketplace()
  const { init: initTokenContract, tokenURI } = useErc721()

  const _initMarketPlace = async (address?: string) => {
    const marketPlaceAddress = address || (await getMarketPlaceAddress())

    if (!marketPlaceAddress) return

    initMarketPlace(marketPlaceAddress)
  }

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

  const _formatToken = (
    token: IMarketplace.UserTokensStructOutput,
  ): TokenBaseInfo => {
    return {
      tokenContract: token.tokenContract,
      tokenIds: token.tokenIds.map(el => new BN(el._hex).toString()),
    }
  }

  const getNfts = async (
    userAddress: string,
    limit: number,
    offset: number,
  ) => {
    if (!limit || !provider.value.isConnected) return []

    await _initContractRegistry(Number(provider.value.chainId))
    await _initMarketPlace()

    const rawData = await getUserTokens(userAddress, limit, offset)

    if (!rawData) return []

    const filteredData = rawData
      .filter(el => el.tokenIds.length > 0)
      .map(el => _formatToken(el))

    // console.log(filteredData)

    // const proccessedData = []

    for (const { tokenContract, tokenIds } of filteredData) {
      initTokenContract(tokenContract)
      for (const tokenId of tokenIds) {
        const metadata = await tokenURI(tokenId)

        if (!metadata) continue

        // const data = await (await fetch(metadata)).json()
        // console.log(metadata)
      }
    }

    return filteredData
  }

  const mintWithEth = async (
    buyParams: BuyParams,
    signature: Signature,
    amountOfEth: string,
  ) => {
    if (!provider.value.chainId) return

    await buyTokenWithETH(buyParams, signature, amountOfEth)
  }

  const mintWithErc20 = async (buyParams: BuyParams, signature: Signature) => {
    if (!provider.value.chainId) return

    await buyTokenWithERC20(buyParams, signature)
  }

  const mintWithNft = async (buyParams: BuyParams, signature: Signature) => {
    if (!provider.value.chainId) return

    await buyTokenWithNFT(buyParams, signature)
  }

  watch(
    () => provider.value.chainId,
    async () => {
      await _initContractRegistry(Number(provider.value.chainId))
      await _initMarketPlace()
    },
    {
      immediate: true,
    },
  )

  return {
    getNfts,
    mintWithEth,
    mintWithErc20,
    mintWithNft,
  }
}
