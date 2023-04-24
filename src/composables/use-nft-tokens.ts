import { api } from '@/api'
import {
  useMarketplace,
  useContractRegistry,
  useErc721,
  useErc20,
} from '@/composables'
import { config } from '@/config'
import { TOKEN_TYPES } from '@/enums'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { PageOrder, Signature, BuyParams } from '@/types'
import { IMarketplace } from '@/types/contracts/MarketPlace'
import { BN } from '@/utils/math.util'
import { computed, ref, watch } from 'vue'

export type TokenBaseInfo = {
  tokenContract: string
  tokenId: string
  metadata: NftMetadata
}

export type TokenFullInfo = TokenBaseInfo & {
  payment: Payment
}

type TokensRaw = {
  tokenContract: string
  tokenIds: Array<string>
}

type NftMetadata = {
  name: string
  description: string
  image: string
  external_url: string
}

type Payment = {
  amount: string
  book_id: number
  contract_address: string
  minted_token_price: string
  payer_address: string
  payment_token_price: string
  purchase_timestamp: string
  token_id: number
  erc20_data: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
  type: TOKEN_TYPES
}

export function useNftTokens() {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()

  const provider = computed(() => web3Store.provider)
  const marketPlaceAddress = ref('')

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry()
  const {
    getUserTokens,
    init: initMarketPlace,
    buyTokenWithERC20,
    buyTokenWithETH,
    buyTokenWithNFT,
  } = useMarketplace()
  const { init: initErc721, tokenURI, approve: approveErc721 } = useErc721()
  const { init: initErc20, approve: approveErc20, getAllowance } = useErc20()

  const _initMarketPlace = async (address?: string) => {
    const _marketPlaceAddress = address || (await getMarketPlaceAddress())

    if (!_marketPlaceAddress) return

    marketPlaceAddress.value = _marketPlaceAddress

    initMarketPlace(_marketPlaceAddress)
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

  const _isErc20TokenApproved = async (
    tokenAmount: string,
    tokenAddress?: string,
  ): Promise<boolean> => {
    if (!provider.value.selectedAddress) return false

    if (tokenAddress) initErc20(tokenAddress)

    const allowance = await getAllowance(
      provider.value.selectedAddress,
      marketPlaceAddress.value,
    )

    if (
      new BN(allowance?.toString() || 0).compare(tokenAmount) === 1 ||
      new BN(allowance?.toString() || 0).compare(tokenAmount) === 0
    ) {
      return true
    } else if (new BN(allowance?.toString() || 0).compare(tokenAmount) === -1) {
      await approveErc20(marketPlaceAddress.value, tokenAmount)
    }

    return _isErc20TokenApproved(tokenAmount)
  }

  const _formatToken = (
    token: IMarketplace.UserTokensStructOutput,
  ): TokensRaw => {
    return {
      tokenContract: token.tokenContract,
      tokenIds: token.tokenIds.map(el => new BN(el._hex).toString()),
    }
  }

  const _getPayment = async (opts: {
    tokenAddress: string
    tokenId: string
    pageLimit?: number
    pageOrder?: PageOrder
  }) => {
    const { data } = await api.get<Payment[]>(
      '/integrations/tracker/payments',
      {
        page: {
          limit: opts.pageLimit || config.DEFAULT_PAGE_LIMIT,
          order: opts.pageOrder || 'desc',
        },
        filter: {
          token_id: opts.tokenId,
          contract_address: opts.tokenAddress,
        },
      },
    )

    return data[0]
  }

  const getNftList = async (
    userAddress: string,
    limit: number,
    offset: number,
  ): Promise<TokenBaseInfo[]> => {
    if (!limit || !provider.value.isConnected) return []

    await _initContractRegistry(Number(provider.value.chainId))
    await _initMarketPlace()

    const rawData = await getUserTokens(userAddress, limit, offset)

    if (!rawData) return []

    const filteredData = rawData
      .filter(el => el.tokenIds.length > 0)
      .map(el => _formatToken(el))

    const proccessedData: TokenBaseInfo[] = []

    let index = 0

    for (const { tokenContract, tokenIds } of filteredData) {
      initErc721(tokenContract)
      for (const tokenId of tokenIds) {
        index++
        const metadata = await tokenURI(tokenId)

        if (!metadata) continue
        if (index === 1) continue

        const data: NftMetadata = await (await fetch(metadata)).json()

        if (!data) continue

        proccessedData.push({
          tokenContract,
          tokenId,
          metadata: data,
        })
      }
    }

    return proccessedData
  }

  const getNft = async (
    collectionAddress: string,
    tokenId: string,
  ): Promise<TokenFullInfo> => {
    if (!provider.value.isConnected)
      throw new Error('Provider is not connected')

    await _initContractRegistry(Number(provider.value.chainId))
    await _initMarketPlace()
    initErc721(collectionAddress)

    const uri = await tokenURI(tokenId)

    if (!uri) throw new Error('Failed to get tokenURI')

    const metadata: NftMetadata = await (await fetch(uri)).json()

    const paymentInfo = await _getPayment({
      tokenAddress: collectionAddress,
      tokenId,
    })

    return {
      tokenContract: collectionAddress,
      tokenId,
      metadata,
      payment: paymentInfo,
    }
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

  const approveTokenSpend = async (
    tokenType: TOKEN_TYPES,
    tokenAmount?: string,
    tokenAddress?: string,
    tokenId?: string,
  ) => {
    if (!provider.value.selectedAddress || !marketPlaceAddress.value) return

    switch (tokenType) {
      case TOKEN_TYPES.erc20:
      case TOKEN_TYPES.voucher:
        if (!tokenAddress || !tokenAmount) return
        await _isErc20TokenApproved(tokenAmount, tokenAddress)
        break
      case TOKEN_TYPES.nft:
        if (!tokenAddress || !tokenId) return
        initErc721(tokenAddress)

        await approveErc721(marketPlaceAddress.value, tokenId)
        break
      default:
        break
    }
  }

  const isNftToken = (object: unknown): object is TokenBaseInfo => {
    return (
      typeof object === 'object' &&
      object !== null &&
      object !== undefined &&
      'tokenId' in object &&
      'metadata' in object &&
      (object as TokenBaseInfo).tokenId !== undefined &&
      (object as TokenBaseInfo).metadata !== undefined
    )
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
    getNftList,
    getNft,
    mintWithEth,
    mintWithErc20,
    mintWithNft,
    isNftToken,
    approveTokenSpend,
  }
}
