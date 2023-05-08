import { api } from '@/api'
import { NftPrice, Platform, TokenPrice } from '@/types'

export function usePricer() {
  const getPlatformsList = () => {
    return api.get<Platform[]>('/integrations/pricer/platforms')
  }

  const getPriceByPlatform = (
    platform: string,
    contract?: string,
    chainID?: number,
  ) => {
    return api.get<TokenPrice>('/integrations/pricer/price', {
      platform,
      ...(contract ? { contract } : {}),
      ...(chainID ? { chain_id: chainID } : {}),
    })
  }

  const getNftPriceByPlatform = (platform: string, contract: string) => {
    return api.get<NftPrice>('/integrations/pricer/nft', {
      platform,
      contract,
    })
  }

  return {
    getNftPriceByPlatform,
    getPriceByPlatform,
    getPlatformsList,
  }
}
