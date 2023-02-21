import { api } from '@/api'
import { config } from '@/config'
import { GENERATED_NFT_STATUSES } from '@/enums'
import {
  CreateTaskResponse,
  MintSignatureResponse,
  PageOrder,
  Task,
  Token,
} from '@/types'

enum TASK_STATUS {
  pending = 1,
  generating = 2,
  finishedGeneration = 3,
  uploading = 4,
  finishedUploading = 5,
}

const DEFAULT_CALL_INTERVAL = 3000 // ms

export function useGenerator() {
  const createNewGenerationTask = async (opts: {
    signature: string
    account: string
    bookId: string
  }): Promise<CreateTaskResponse> => {
    const { data } = await api.post<CreateTaskResponse>(
      '/integrations/generator/tasks',
      {
        data: {
          type: 'tasks',
          attributes: {
            signature: opts.signature,
            account: opts.account,
            book_id: +opts.bookId,
          },
        },
      },
    )

    return data
  }

  const getGenerationTaskById = async (id: string | number): Promise<Task> => {
    const { data } = await api.get<Task>(`/integrations/generator/tasks/${id}`)

    return data
  }

  const getGeneratedTask = (
    id: string | number,
    callInterval = DEFAULT_CALL_INTERVAL,
  ): Promise<Task | undefined> => {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const task = await getGenerationTaskById(id)

          if (task.status === TASK_STATUS.finishedGeneration) {
            clearInterval(intervalId)
            resolve(task)
          }
        } catch (error) {
          clearInterval(intervalId)
          reject(error)
        }
      }, callInterval)
    })
  }

  const getMintSignature = async (
    platform: string,
    taskId: string | number,
    tokenAddress?: string,
    promocodeId?: string,
    isNft = false,
  ): Promise<MintSignatureResponse> => {
    const apiEndpoint = isNft
      ? '/integrations/generator/signature/mint/nft'
      : '/integrations/generator/signature/mint'

    const { data } = await api.get<MintSignatureResponse>(apiEndpoint, {
      platform,
      task_id: taskId,
      ...(promocodeId ? { promocode_id: promocodeId } : {}),
      ...(tokenAddress ? { token_address: tokenAddress } : {}),
    })

    return data
  }

  const getGeneratedTokens = (opts?: {
    account?: string[]
    status?: GENERATED_NFT_STATUSES[]
    pageLimit?: number
    pageOrder?: PageOrder
  }) => {
    return api.get<Token[]>('/integrations/generator/tokens', {
      page: {
        limit: opts?.pageLimit || config.DEFAULT_PAGE_LIMIT,
        order: opts?.pageOrder || 'desc',
      },
      filter: {
        ...(opts?.account?.length ? { account: opts.account.join(',') } : {}),
        ...(opts?.status?.length ? { status: opts.status.join(',') } : {}),
      },
    })
  }

  const getGeneratedTokenById = async (id: string | number): Promise<Token> => {
    const { data } = await api.get<Token>(
      `/integrations/generator/tokens/${id}`,
    )

    return data
  }

  return {
    createNewGenerationTask,
    getGenerationTaskById,
    getMintSignature,
    getGeneratedTask,
    getGeneratedTokens,
    getGeneratedTokenById,
  }
}
