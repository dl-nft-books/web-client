import { api } from '@/api'
import {
  useMarketplace,
  useContractRegistry,
  useErc721,
  useErc20,
  useGenerator,
} from '@/composables'
import { config } from '@/config'
import { TOKEN_TYPES } from '@/enums'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import {
  PageOrder,
  Signature,
  BuyParams,
  FullBookInfo,
  Payment,
  NftMetadata,
  TokenBaseInfo,
  TokenFullInfo,
} from '@/types'
import { IMarketplace } from '@/types/contracts/MarketPlace'
import { BN } from '@/utils/math.util'
import { computed, ref, watch } from 'vue'
import { useFetch } from '@vueuse/core'
import { constants } from 'ethers'

type TokensRaw = {
  tokenContract: string
  tokenIds: Array<string>
}

const MAX_METADATA_WAIT_TIME = 8000 // ms

export function useNftTokens() {
  const networkStore = useNetworksStore()
  const web3ProvidersStore = useWeb3ProvidersStore()

  const marketPlaceAddress = ref('')

  const provider = computed(() => {
    if (
      web3ProvidersStore.provider.isConnected &&
      web3ProvidersStore.isValidChain
    )
      return web3ProvidersStore.provider

    return web3ProvidersStore.fallbackProvider
  })

  const { getMarketPlaceAddress, init: initRegistry } =
    useContractRegistry(provider)

  const {
    getUserTokens,
    init: initMarketPlace,
    buyTokenWithERC20,
    buyTokenWithETH,
    buyTokenWithNFT,
  } = useMarketplace(provider)

  const {
    init: initErc721,
    tokenURI,
    approve: approveErc721,
  } = useErc721(provider)

  const {
    init: initErc20,
    approve: approveErc20,
    getAllowance,
  } = useErc20(provider)

  const _initMarketPlace = async (address?: string) => {
    const _marketPlaceAddress = address || (await getMarketPlaceAddress())

    if (!_marketPlaceAddress) return

    marketPlaceAddress.value = _marketPlaceAddress

    initMarketPlace(_marketPlaceAddress)
  }

  const _initContractRegistry = async (chainId: number) => {
    const appropriateRegistryAddress = networkStore.getRegistryAddress(chainId)

    initRegistry(appropriateRegistryAddress)
  }

  const _isErc20TokenApproved = async (
    tokenAmount: string,
    tokenAddress?: string,
  ): Promise<boolean> => {
    if (!provider.value.address) return false

    if (tokenAddress) initErc20(tokenAddress)

    const allowance = await getAllowance(
      provider.value.address,
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

  const _loadMetadata = async (
    tokenUri: string,
    maxTimeout = MAX_METADATA_WAIT_TIME,
  ) => {
    const { execute: fetchMetaData, data } = useFetch(tokenUri, {
      immediate: false,
      timeout: maxTimeout,
    })
      .get()
      .json<NftMetadata>()

    await fetchMetaData()

    return data.value
  }

  const getNftList = async (
    userAddress: string,
    limit: number,
    offset: number,
  ): Promise<TokenBaseInfo[]> => {
    if (!limit) return []

    await _initContractRegistry(Number(provider.value.chainId))
    await _initMarketPlace()

    const rawData = await getUserTokens(userAddress, limit, offset)

    if (!rawData) return []

    const filteredData = rawData
      .filter(el => el.tokenIds.length > 0)
      .map(el => _formatToken(el))

    const proccessedData: TokenBaseInfo[] = []

    for (const { tokenContract, tokenIds } of filteredData) {
      initErc721(tokenContract)
      for (const tokenId of tokenIds) {
        const metadataUrl = await tokenURI(tokenId)

        if (!metadataUrl) continue

        const metadata = await _loadMetadata(metadataUrl)

        if (!metadata) continue

        proccessedData.push({
          tokenContract,
          tokenId,
          metadata,
        })
      }
    }

    return proccessedData
  }

  const getNft = async (
    collectionAddress: string,
    tokenId: string,
  ): Promise<TokenFullInfo> => {
    await _initContractRegistry(Number(provider.value.chainId))
    await _initMarketPlace()
    initErc721(collectionAddress)

    const metadataUrl = await tokenURI(tokenId)

    if (!metadataUrl) throw new Error('Failed to get tokenURI')

    const metadata = await _loadMetadata(metadataUrl)

    if (!metadata) throw new Error('Failed to get metadata')

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
    if (!provider.value.address || !marketPlaceAddress.value) return

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

  const buildFormMintData = async (initialOpts: {
    banner: FormData
    book: FullBookInfo
    account: string
    chainId: number
    tokenAddress: string
    promocodeId?: string
    nftId?: string // for NFT for NFT exchange
  }): Promise<{
    buyParams: BuyParams
    signature: Signature
  }> => {
    const { createNewGenerationTask, uploadBanner, getMintSignature } =
      useGenerator()

    const task = await createNewGenerationTask({
      account: initialOpts.account,
      bookId: initialOpts.book.id,
      chainId: initialOpts.chainId,
    })

    const generatedTask = await uploadBanner(task.id, initialOpts.banner)

    const mintSignature = await getMintSignature(
      generatedTask.id,
      initialOpts.tokenAddress,
      initialOpts.promocodeId,
      Boolean(initialOpts.nftId),
    )

    const bookContract = initialOpts.book.networks.find(
      el => el.attributes.chain_id === initialOpts.chainId,
    )

    if (!bookContract)
      throw new Error('No matching book contract found for that chain')

    return {
      buyParams: {
        tokenContract: bookContract.attributes.contract_address,
        recipient: initialOpts.account,
        tokenData: {
          tokenId: mintSignature.token_id.toString(),
          tokenURI: generatedTask.metadata_ipfs_hash,
        },
        paymentDetails: {
          paymentTokenAddress:
            initialOpts.tokenAddress || constants.AddressZero,
          paymentTokenPrice: mintSignature.price,
          nftTokenId: initialOpts.nftId ?? '0',
          discount: mintSignature.discount,
        },
      },
      signature: {
        ...mintSignature.signature,
        endSigTimestamp: mintSignature.end_timestamp,
      },
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
    buildFormMintData,
  }
}
