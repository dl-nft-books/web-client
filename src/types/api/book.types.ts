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
