import { TokenPrice, Platform } from '@/types'
import { api } from '@/api'

export function getPlatformsList() {
  return api.get<Platform[]>('/integrations/pricer/platforms')
}

export function getPriceByPlatform(platform: string, contract?: string) {
  return api.get<TokenPrice>('/integrations/pricer/price', {
    platform,
    ...(contract ? { contract } : {}),
  })
}