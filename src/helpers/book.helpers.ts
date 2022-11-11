import { api } from '@/api'
import { BookResponse } from '@/types'
import { BOOK_DEPLOY_STATUSES } from '@/enums'

export async function getBooks(opts: {
  deployStatus?: BOOK_DEPLOY_STATUSES[]
}) {
  const { data } = await api.get<BookResponse[]>('/integrations/books', {
    page: {
      limit: 100, // FIXME: add pagination
    },
    filter: {
      ...(opts.deployStatus?.length
        ? { deploy_status: opts.deployStatus.join(',') }
        : {}),
    },
  })

  return data
}

export async function getBookById(id: number | string) {
  const { data } = await api.get<BookResponse>(`/integrations/books/${id}`)

  return data
}
