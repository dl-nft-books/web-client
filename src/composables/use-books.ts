import { api } from '@/api'
import { Book, FullBookInfo, BaseBookInfo } from '@/types'
import { ChainId } from '@distributedlab/w3p'
import { useMarketplace, useContractRegistry } from '@/composables'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { BN } from '@/utils/math.util'

import { IMarketplace } from '@/types/contracts/MarketPlace'
import { config } from '@/config'
import { computed } from 'vue'

export function useBooks(contractRegistryAddress?: string) {
  const networkStore = useNetworksStore()
  const web3ProvidersStore = useWeb3ProvidersStore()

  const provider = computed(() => {
    if (
      web3ProvidersStore.provider.isConnected &&
      web3ProvidersStore.isValidChain
    )
      return web3ProvidersStore.provider

    return web3ProvidersStore.fallbackProvider
  })

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry(
    provider,
    contractRegistryAddress,
  )

  const {
    init: initMarketPlace,
    getTokenParams,
    getBooksBatch,
    getTokenContractsCount,
  } = useMarketplace(provider)

  const _initMarketPlace = async (address?: string) => {
    const marketPlaceAddress = address || (await getMarketPlaceAddress())

    if (!marketPlaceAddress) return

    initMarketPlace(marketPlaceAddress)
  }

  const _initContractRegistry = async (chainId: number) => {
    const appropriateRegistryAddress = networkStore.getRegistryAddress(chainId)

    initRegistry(appropriateRegistryAddress)
  }

  const _formatBaseParams = (
    backendData: Book,
    contractData: IMarketplace.BriefTokenInfoStructOutput,
  ): BaseBookInfo => {
    return {
      ...backendData,
      pricePerOneToken: new BN(contractData.pricePerOneToken._hex).toString(),
      tokenName: contractData.baseTokenData.tokenName,
      tokenContract: contractData.baseTokenData.tokenContract,
      isDisabled: contractData.isDisabled,
      tokenSymbol: contractData.baseTokenData.tokenSymbol,
    }
  }

  const _formatDetailedParams = (
    backendData: Book,
    contractData: IMarketplace.DetailedTokenInfoStructOutput,
  ): FullBookInfo => {
    return {
      ...backendData,
      pricePerOneToken: new BN(
        contractData.tokenParams.pricePerOneToken._hex,
      ).toString(),
      minNFTFloorPrice: new BN(
        contractData.tokenParams.minNFTFloorPrice._hex,
      ).toString(),
      voucherTokenContract: contractData.tokenParams.voucherTokenContract,
      voucherTokensAmount: new BN(
        contractData.tokenParams.voucherTokensAmount._hex,
      ).toString(),
      fundsRecipient: contractData.tokenParams.fundsRecipient,
      isNFTBuyable: contractData.tokenParams.isNFTBuyable,
      isDisabled: contractData.tokenParams.isDisabled,
      tokenName: contractData.baseTokenData.tokenName,
      tokenSymbol: contractData.baseTokenData.tokenSymbol,
      tokenContract: contractData.baseTokenData.tokenContract,
      isVoucherBuyable: contractData.tokenParams.isVoucherBuyable,
    }
  }

  const _gatherDetailedBookData = async (
    book: Book,
    chainId: number,
  ): Promise<FullBookInfo> => {
    const bookNetwork = book.networks.find(
      el => el.attributes.chain_id === chainId,
    )

    let bookContractAddress = bookNetwork?.attributes.contract_address

    /* 
      in case we don't have book on current chain - 
      we use the contract that matches default chain 
    */
    if (!bookContractAddress) {
      bookContractAddress = book.networks.find(
        book => book.attributes.chain_id === Number(config.DEFAULT_CHAIN_ID),
      )?.attributes.contract_address

      if (!bookContractAddress) throw new Error('failed to get book address')
    }

    const bookParams = await getTokenParams([bookContractAddress])

    if (!bookParams) throw new Error('Failed to get info from contract')

    return _formatDetailedParams(book, bookParams[0])
  }

  const _gatherBaseBookData = (
    backendInfoPart: Book[],
    contractInfoPart: IMarketplace.BriefTokenInfoStructOutput[],
  ): BaseBookInfo[] => {
    const formattedArray = contractInfoPart.map(book => {
      const matchingInfo = backendInfoPart.find(el =>
        el.networks.find(
          network =>
            network.attributes.contract_address ===
            book.baseTokenData.tokenContract,
        ),
      )

      if (!matchingInfo) return null

      return _formatBaseParams(matchingInfo, book)
    })

    return formattedArray.filter(book => Boolean(book)) as BaseBookInfo[]
  }

  const _fetchBooksList = async (contractFilter: string, limit: number) => {
    const { data: dataWithoutNetworks } = await api.get<Book[]>(
      '/integrations/books',
      {
        filter: {
          contract: contractFilter,
        },
        page: {
          limit: limit,
          order: 'desc',
        },
      },
    )

    if (!dataWithoutNetworks.length) return []

    const { data } = await api.get<Book[]>('/integrations/books', {
      filter: {
        id: dataWithoutNetworks.map(book => book.id).join(','),
      },
      page: {
        limit: limit,
        order: 'desc',
      },
    })

    return data
  }

  const getBooksFromContract = async (
    limit: number,
    offset: number,
    chainId: ChainId,
  ) => {
    if (!limit) return []

    await _initContractRegistry(Number(chainId))
    await _initMarketPlace()

    const bookContractsList = await getBooksBatch(limit, offset)

    if (!bookContractsList?.length) return []

    const booksFromBackend = await _fetchBooksList(
      bookContractsList.map(book => book.baseTokenData.tokenContract).join(','),
      limit,
    )

    const formattedBooks = _gatherBaseBookData(
      booksFromBackend,
      bookContractsList,
    )

    return formattedBooks
  }

  const getTotalBooksAmount = async (chainId: ChainId) => {
    await _initContractRegistry(Number(chainId))
    await _initMarketPlace()

    const amount = await getTokenContractsCount()

    if (!amount) return

    return new BN(amount._hex).toString()
  }

  const getBookById = async (
    id: number | string,
    chainId: ChainId,
  ): Promise<FullBookInfo> => {
    await _initContractRegistry(Number(chainId))
    await _initMarketPlace()

    const { data } = await api.get<Book>(`/integrations/books/${id}`)

    const bookData = await _gatherDetailedBookData(data, Number(chainId))

    return bookData
  }

  return {
    getBookById,
    getBooksFromContract,
    getTotalBooksAmount,
  }
}
