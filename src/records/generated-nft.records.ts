import { GeneratedNFtResponse } from '@/types'
import { BookPaymentRecord } from '@/records'

export class GeneratedNFtRecord {
  id: string
  tokenId: string
  name: string
  description: string
  imageUrl: string
  signature: string
  status: string
  payment: BookPaymentRecord

  constructor(record: GeneratedNFtResponse) {
    this.id = record.id
    this.tokenId = record.token_id
    this.name = record.name
    this.description = record.description
    this.imageUrl = record.image_url
    this.status = record.status
    this.signature = record.signature
    this.payment = new BookPaymentRecord(record.payment)
  }
}
