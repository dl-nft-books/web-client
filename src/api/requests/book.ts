import { api } from '@/api'
import { BookResponse, PageOrder } from '@/types'
import { BOOK_DEPLOY_STATUSES } from '@/enums'

export function getBooks(
  opts: {
    deployStatus?: BOOK_DEPLOY_STATUSES[]
    chainId?: number
    pageLimit?: number
    pageOrder?: PageOrder
  } = { pageLimit: 100, pageOrder: 'desc' }, // FIXME: add pagination
) {
  return api.get<BookResponse[]>('/integrations/books', {
    page: {
      limit: opts.pageLimit,
      order: opts.pageOrder,
    },
    filter: {
      ...(opts.deployStatus?.length
        ? { deploy_status: opts.deployStatus.join(',') }
        : {}),
      ...(opts.chainId ? { chain_id: opts.chainId } : {}),
    },
  })
}

export function getBookById(id: number | string) {
  return api.get<BookResponse>(`/integrations/books/${id}`)
}
