import { api } from '@/api'
import { config } from '@/config'
import { Book, PageOrder } from '@/types'
import { BOOK_DEPLOY_STATUSES } from '@/enums'

export function useBooks() {
  const getBooks = async (opts: {
    title?: string
    deployStatus?: BOOK_DEPLOY_STATUSES[]
    chainId?: number
    pageLimit?: number
    pageOrder?: PageOrder
  }) => {
    const data = await api.get<Book[]>('/integrations/books', {
      page: {
        limit: opts.pageLimit || config.DEFAULT_PAGE_LIMIT,
        order: opts.pageOrder || 'desc',
      },
      filter: {
        ...(opts.title ? { title: opts.title } : {}),
        ...(opts.deployStatus?.length
          ? { deploy_status: opts.deployStatus.join(',') }
          : {}),
        ...(opts.chainId ? { chain_id: opts.chainId } : {}),
      },
    })

    return data
  }

  const getBookById = async (id: number | string) => {
    const { data } = await api.get<Book>(`/integrations/books/${id}`)

    return data
  }

  return {
    getBooks,
    getBookById,
  }
}
