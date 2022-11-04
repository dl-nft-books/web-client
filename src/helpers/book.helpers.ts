import { api } from '@/api'
import { BookResponse } from '@/types'

export async function getBooks() {
  const { data } = await api.get<BookResponse[]>('/integrations/books')

  return data
}

export async function getBookById(id: number | string) {
  const { data } = await api.get<BookResponse>(`/integrations/books/${id}`)

  return data
}
