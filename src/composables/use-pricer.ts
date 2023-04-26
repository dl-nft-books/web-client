import { api } from '@/api'
import { NftPrice, TokenPrice } from '@/types'

export function usePricer() {
  const getPrice = (chainId: number, erc20Address?: string) => {
    return api.get<TokenPrice>('/integrations/pricer/price', {
      ...(erc20Address ? { contract: erc20Address } : {}),
      chain_id: chainId,
    })
  }

  const getNftPrice = (chainId: number, nftAddress: string) => {
    return api.get<NftPrice>('/integrations/pricer/nft', {
      contract: nftAddress,
      chain_id: chainId,
    })
  }

  return {
    getNftPrice,
    getPrice,
  }
}
