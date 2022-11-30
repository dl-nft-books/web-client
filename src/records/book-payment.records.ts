import { BookPayment } from '@/types'

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
