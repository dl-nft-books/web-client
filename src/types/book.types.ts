export interface BookFileResponse {
  id: string
  type: string
  attributes: {
    key: string
    mime_type: string
    name: string
    url: string
  }
}

export interface BookResponse {
  banner: BookFileResponse
  contract_address: string
  contract_name: string
  contract_version: string
  created_at: string
  description: string
  file: BookFileResponse
  id: string
  price: string
  title: string
  type: string
}

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
  price: string
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
