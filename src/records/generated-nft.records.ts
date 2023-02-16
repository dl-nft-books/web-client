import { BookPayment, BookPaymentNftExchange, Token } from '@/types'
import { BookPaymentRecord, BookPaymentNftExchangeRecord } from '@/records'

export class GeneratedNFtRecord {
  id: string
  tokenId: string
  name: string
  description: string
  imageUrl: string
  signature: string
  status: string
  isTokenPayment: boolean
  payment?: BookPaymentRecord | BookPaymentNftExchangeRecord

  constructor(record: Token) {
    this.id = record.id
    this.tokenId = record.token_id
    this.name = record.name
    this.description = record.description
    this.imageUrl = record.image_url
    this.status = record.status
    this.signature = record.signature
    this.isTokenPayment = record.is_token_payment

    if (record.payment?.payer_address) {
      this.payment = record.is_token_payment
        ? new BookPaymentRecord(record.payment as BookPayment)
        : new BookPaymentNftExchangeRecord(
            record.payment as BookPaymentNftExchange,
          )
    }
  }
}
