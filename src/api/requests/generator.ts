import {
  Token,
  Task,
  PageOrder,
  MintSignatureResponse,
  CreateTaskResponse,
} from '@/types'
import { GENERATED_NFT_STATUSES } from '@/enums'
import { api } from '@/api'

export function createNewTask(opts: {
  signature: string
  account: string
  bookId: string
}) {
  return api.post<CreateTaskResponse>('/integrations/generator/tasks', {
    data: {
      type: 'tasks',
      attributes: {
        signature: opts.signature,
        account: opts.account,
        book_id: +opts.bookId,
      },
    },
  })
}

export function getTaskById(id: string | number) {
  return api.get<Task>(`/integrations/generator/tasks/${id}`)
}

export function getMintSignature(
  platform: string,
  taskId: string | number,
  tokenAddress?: string,
) {
  return api.get<MintSignatureResponse>(
    '/integrations/generator/signature/mint',
    {
      platform,
      task_id: taskId,
      ...(tokenAddress ? { token_address: tokenAddress } : {}),
    },
  )
}
export function getGeneratedTokens(opts?: {
  account?: string[]
  status?: GENERATED_NFT_STATUSES[]
  pageLimit?: number
  pageOrder?: PageOrder
}) {
  return api.get<Token[]>('/integrations/generator/tokens', {
    page: {
      limit: opts?.pageLimit || 100, // FIXME: add pagination
      order: opts?.pageOrder || 'desc',
    },
    filter: {
      ...(opts?.account?.length ? { account: opts.account.join(',') } : {}),
      ...(opts?.status?.length ? { status: opts.status.join(',') } : {}),
    },
  })
}

export function getGeneratedTokensById(id: string | number) {
  return api.get<Token>(`/integrations/generator/tokens/${id}`)
}
