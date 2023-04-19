import { api } from '@/api'
import { Book, ChainId } from '@/types'
import { useMarketplace, useContractRegistry } from '@/composables/contracts'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { computed } from 'vue'
import { BN } from '@/utils/math.util'

import { IMarketplace } from '@/types/contracts/MarketPlace'
import { switchNetwork } from '@/helpers'

// Info about book gathering partly from backend and partly from contract
export type FullBookInfo = Book &
  Omit<IMarketplace.DetailedTokenParamsStruct, 'tokenParams'> &
  IMarketplace.TokenParamsStruct
export type BaseBookInfo = Book & IMarketplace.BaseTokenParamsStruct

export function useBooks(contractRegistryAddress?: string) {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()
  const provider = computed(() => web3Store.provider)

  const { getMarketPlaceAddress, init: initRegistry } = useContractRegistry(
    contractRegistryAddress,
  )

  const {
    init: initMarketPlace,
    getTokenParams,
    getBooksBatch,
  } = useMarketplace()

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

  const _formatBaseParams = (
    backendData: Book,
    contractData: IMarketplace.BaseTokenParamsStructOutput,
  ): BaseBookInfo => {
    return {
      ...backendData,
      pricePerOneToken: new BN(contractData.pricePerOneToken._hex).toString(),
      tokenName: contractData.tokenName,
      tokenContract: contractData.tokenContract,
      isDisabled: contractData.isDisabled,
    }
  }

  const _formatDetailedParams = (
    backendData: Book,
    contractData: IMarketplace.DetailedTokenParamsStructOutput,
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
      tokenName: contractData.tokenName,
      tokenSymbol: contractData.tokenSymbol,
      tokenContract: contractData.tokenContract,
    }
  }

  const _gatherDetailedBookData = async (book: Book): Promise<FullBookInfo> => {
    if (!networkStore.list.length) {
      await networkStore.loadNetworks()
    }

    const bookNetwork = book.networks.find(
      el => el.attributes.chain_id === Number(provider.value.chainId),
    )

    // console.log(bookNetwork, provider.value.chainId)

    if (!bookNetwork) throw new Error('failed to get appropriate info source')

    _initContractRegistry(bookNetwork.attributes.chain_id)
    await _initMarketPlace()
    const bookParams = await getTokenParams([
      bookNetwork.attributes.contract_address,
    ])

    if (!bookParams) throw new Error('Failed to get info from contract')

    return _formatDetailedParams(book, bookParams[0])
  }

  const _gatherBaseBookData = (
    backendInfoPart: Book[],
    contractInfoPart: IMarketplace.BaseTokenParamsStructOutput[],
  ): BaseBookInfo[] => {
    const formattedArray = contractInfoPart.map(book => {
      const matchingInfo = backendInfoPart.find(el =>
        el.networks.find(
          network => network.attributes.contract_address === book.tokenContract,
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

    if (!networkStore.list.length) {
      await networkStore.loadNetworks()
    }

    if (
      !networkStore.list.some(network => network.chain_id === Number(chainId))
    ) {
      return []
    }

    if (provider.value.isConnected) await switchNetwork(chainId)
    await _initContractRegistry(Number(chainId))
    await _initMarketPlace()

    const bookContractsList = await getBooksBatch(limit, offset)

    if (!bookContractsList?.length) return []

    const booksFromBackend = await _fetchBooksList(
      bookContractsList.map(book => book.tokenContract).join(','),
      limit,
    )

    const formattedBooks = _gatherBaseBookData(
      booksFromBackend,
      bookContractsList,
    )

    return formattedBooks
  }

  const getBookById = async (id: number | string): Promise<FullBookInfo> => {
    await _initContractRegistry(Number(provider.value.chainId))
    await _initMarketPlace()

    const { data } = await api.get<Book>(`/integrations/books/${id}`)

    const bookData = await _gatherDetailedBookData(data)

    return bookData
  }

  return {
    getBookById,
    getBooksFromContract,
  }
}
