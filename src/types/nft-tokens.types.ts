import { TOKEN_TYPES } from '@/enums'

export type NftMetadata = {
  name: string
  description: string
  image: string
  external_url: string
}

export type Payment = {
  amount: string
  book_id: number
  contract_address: string
  minted_token_price: string
  payer_address: string
  payment_token_price: string
  purchase_timestamp: string
  token_id: number
  erc20_data: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
  type: TOKEN_TYPES
}

export type TokenBaseInfo = {
  tokenContract: string
  tokenId: string
  metadata: NftMetadata
}

export type TokenFullInfo = TokenBaseInfo & {
  payment: Payment
}
