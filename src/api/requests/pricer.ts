import { TokenPriceResponse, Platform } from '@/types'
import { api } from '@/api'

export function getPlatformsList() {
  return api.get<Platform[]>('/integrations/pricer/platforms')
}

export function getPriceByPlatform(platform: string, contract?: string) {
  return api.get<TokenPriceResponse>('/integrations/pricer/price', {
    platform,
    ...(contract ? { contract } : {}),
  })
}
