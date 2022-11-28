import { JsonApiRecordBase } from '@/types/api'

export type BookFileResponse = JsonApiRecordBase<'files'> & {
  attributes: {
    key: string
    mime_type: string
    name: string
    url: string
  }
}

export type BookResponse = JsonApiRecordBase<'books'> & {
  banner: BookFileResponse
  contract_address: string
  contract_name: string
  contract_version: string
  created_at: string
  description: string
  file: BookFileResponse
  price: string
  title: string
}
