export interface TokenPriceResponse {
  price: string
  token: {
    decimals: number
    symbol: string
    name: string
  }
}

export type BookPaymentResponse = {
  id: number | string
  type: string
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

export interface GeneratedNFtResponse {
  id: string
  token_id: string
  name: string
  description: string
  image_url: string
  signature: string
  status: string
  payment: BookPaymentResponse
}
