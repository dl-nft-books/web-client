import { Book, JsonApiRecordBase } from '@/types'

export type Task = JsonApiRecordBase<'files'> & {
  id: string
  token_id: string | number
  book_id: string
  signature: string
  ipfs_hash: string
  status: number
  file_ipfs_hash: string
  metadata_ipfs_hash: string
  uri: string
  book: Book
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

export type Token = JsonApiRecordBase<'tokens'> & {
  token_id: string
  name: string
  description: string
  image_url: string
  signature: string
  status: string
  payment: BookPayment
}

export type MintSignatureResponse = JsonApiRecordBase<'prices'> & {
  price: string
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
