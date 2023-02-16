import { BookPayment, BookPaymentNftExchange } from '@/types'

export class BookPaymentRecord {
  id: number | string
  type: string
  payerAddress: string
  amount: string
  mintedTokenPrice: string
  purchaseTimestamp: string
  erc20Address: string
  erc20Symbol: string
  erc20Name: string
  erc20Decimals: number
  bookUrl: string

  constructor(record: BookPayment) {
    this.id = record.id
    this.type = record.type
    this.payerAddress = record.payer_address
    this.amount = record.amount
    this.mintedTokenPrice = record.minted_token_price
    this.purchaseTimestamp = record.purchase_timestamp
    this.erc20Address = record.erc20_data.address
    this.erc20Symbol = record.erc20_data.symbol
    this.erc20Name = record.erc20_data.name
    this.erc20Decimals = record.erc20_data.decimals
    this.bookUrl = record.book_url
  }
}

export class BookPaymentNftExchangeRecord {
  id: number | string
  type: string
  payerAddress: string
  mintedTokenPrice: string
  purchaseTimestamp: string
  bookUrl: string
  nftAddress: string
  nftId: number | string
  floorPrice: string

  constructor(record: BookPaymentNftExchange) {
    this.id = record.id
    this.type = record.type
    this.payerAddress = record.payer_address
    this.floorPrice = record.floor_price
    this.mintedTokenPrice = record.minted_token_price
    this.purchaseTimestamp = record.purchase_timestamp
    this.bookUrl = record.book_url
    this.nftAddress = record.nft_address
    this.nftId = record.nft_id
  }
}
