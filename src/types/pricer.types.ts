import { JsonApiRecordBase } from '@distributedlab/jac'

export type TokenPrice = JsonApiRecordBase<'prices'> & {
  price: string
  token: {
    decimals: number
    symbol: string
    name: string
  }
}

export type NftPrice = JsonApiRecordBase<'nft-price'> & {
  floor_price: number
}
