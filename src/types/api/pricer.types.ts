import { JsonApiRecordBase } from '@/types'

export type Platform = JsonApiRecordBase<'platforms'> & {
  chain_identifier: number
  name: string
  shortname: string
}

export type TokenPrice = JsonApiRecordBase<'prices'> & {
  price: string
  token: {
    decimals: number
    symbol: string
    name: string
  }
}

export type NftPrice = JsonApiRecordBase<'nft-price'> & {
  native_currency: number
  usd: number
}
