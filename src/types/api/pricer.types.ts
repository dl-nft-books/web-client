import { JsonApiRecordBase } from '@/types/api'

export type Platform = JsonApiRecordBase<'platforms'> & {
  chain_identifier: number
  name: string
  shortname: string
}

export type TokenPriceResponse = JsonApiRecordBase<'prices'> & {
  price: string
  token: {
    decimals: number
    symbol: string
    name: string
  }
}
