import { api } from '@/api'
import { config } from '@/config'
import { GENERATED_NFT_STATUSES } from '@/enums'
import {
  BookPayment,
  BookPaymentNftExchange,
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

type TokenWithRegularPayment = Token & {
  payment: BookPayment
}

type ExchangedToken = Token & {
  payment: BookPaymentNftExchange
}

export function useGenerator() {
  const createNewGenerationTask = async (opts: {
    account: string
    bookId: string
    chainId: number
    banner?: FormData
  }): Promise<CreateTaskResponse> => {
    const { data } = await api.post<CreateTaskResponse>(
      '/integrations/core/tasks',
      {
        data: {
          type: 'tasks',
          attributes: {
            account: opts.account,
            book_id: +opts.bookId,
            chain_id: opts.chainId,
          },
        },
      },
    )

    return data
  }

  const getGenerationTaskById = async (id: string | number): Promise<Task> => {
    const { data } = await api.get<Task>(`/integrations/core/tasks/${id}`)

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
      ? '/integrations/core/signature/mint/nft'
      : '/integrations/core/signature/mint'

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
    return api.get<Token[]>('/integrations/core/tokens', {
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
    const { data } = await api.get<Token>(`/integrations/core/tokens/${id}`)

    return data
  }

  const isToken = (object: unknown): object is Token => {
    return (
      typeof object === 'object' &&
      object !== null &&
      object !== undefined &&
      'payment' in object &&
      (object as Token).payment !== undefined
    )
  }

  const isTokenWithRegularPayment = (
    object: unknown,
  ): object is TokenWithRegularPayment => {
    return (
      isToken(object) &&
      object.payment !== undefined &&
      'erc20_data' in object.payment
    )
  }

  const isExchangedToken = (object: unknown): object is ExchangedToken => {
    return (
      isToken(object) &&
      object.payment !== undefined &&
      'nft_address' in object.payment
    )
  }

  return {
    createNewGenerationTask,
    getGenerationTaskById,
    getMintSignature,
    getGeneratedTask,
    getGeneratedTokens,
    isToken,
    isTokenWithRegularPayment,
    isExchangedToken,
    getGeneratedTokenById,
  }
}
