import { JsonApiRecordBase } from '@/types'

export type Task = JsonApiRecordBase<'files'> & {
  id: string
  token_name: string
  book_id: string
  chain_id: string | number
  status: number
  banner_ipfs_hash: string
  metadata_ipfs_hash: string
  uri: string
}

export type BookPayment = JsonApiRecordBase<'payment'> & {
  payer_address: string
  amount: string
  minted_token_price: string
  purchase_timestamp: string
  book_url: string
  erc20_data: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
}

export type BookPaymentNftExchange = JsonApiRecordBase<'payment'> & {
  payer_address: string
  floor_price: string
  nft_address: string
  nft_id: number
  minted_token_price: string
  purchase_timestamp: string
  book_url: string
}

export type Token = JsonApiRecordBase<'tokens'> & {
  token_id: string
  name: string
  description: string
  image_url: string
  signature: string
  status: string
  is_token_payment: boolean
  payment?: BookPayment | BookPaymentNftExchange
}

export type MintSignatureResponse = JsonApiRecordBase<'prices'> & {
  price: string
  token_id: string | number
  discount: string
  end_timestamp: number
  signature: {
    id: string
    type: 'signatures'
    r: string
    s: string
    v: number
  }
}

export type CreateTaskResponse = JsonApiRecordBase<'tasks'>
