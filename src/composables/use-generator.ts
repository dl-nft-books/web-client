import { api } from '@/api'
import { computed } from 'vue'
import { CreateTaskResponse, MintSignatureResponse, Task } from '@/types'
import { useVoucher, useContractRegistry } from '@/composables'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'

enum TASK_STATUS {
  pending = 1,
  generating = 2,
  finishedGeneration = 3,
  uploading = 4,
  finishedUploading = 5,
}

const DEFAULT_CALL_INTERVAL = 3000 // ms

export function useGenerator() {
  const networkStore = useNetworksStore()
  const web3Store = useWeb3ProvidersStore()
  const provider = computed(() => web3Store.provider)

  const { init: initRegistry, getMarketPlaceAddress } = useContractRegistry()

  const _initContractRegistry = async () => {
    if (!networkStore.list.length) {
      await networkStore.loadNetworks()
    }

    const appropriateRegistryAddress = networkStore.list.find(
      network => network.chain_id === Number(provider.value.chainId),
    )?.factory_address

    if (!appropriateRegistryAddress)
      throw new Error('failed to get registry address')

    initRegistry(appropriateRegistryAddress)
  }

  const createNewGenerationTask = async (opts: {
    account: string
    bookId: string
    chainId: number
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

  const uploadBanner = async (
    taskId: string,
    banner: FormData,
  ): Promise<Task> => {
    const { data } = await api.post<Task>(
      `/integrations/core/tasks/${taskId}/banner`,
      banner,
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

  const sendBuyWithVoucherRequest = async (
    voucherAddress: string,
    voucherAmount: string,
    taskId: number,
  ) => {
    if (!provider.value.selectedAddress) return

    await _initContractRegistry()

    const spender = await getMarketPlaceAddress()

    if (!spender) throw new Error('failed to get marketplace address')

    const { getPermitSignature } = useVoucher(voucherAddress)

    const permitSignature = await getPermitSignature(
      provider.value.selectedAddress,
      spender,
      voucherAmount,
    )

    if (!permitSignature) throw new Error('failed to form signature')

    await api.post('/integrations/core/buy/voucher', {
      data: {
        attributes: {
          voucher_address: voucherAddress,
          task_id: taskId,
          end_sig_timestamp: permitSignature.endSigTimestamp,
          permit_sig: {
            attributes: {
              r: permitSignature.r,
              s: permitSignature.s,
              v: permitSignature.v,
            },
          },
        },
      },
    })
  }

  return {
    createNewGenerationTask,
    getGenerationTaskById,
    getMintSignature,
    getGeneratedTask,
    uploadBanner,
    sendBuyWithVoucherRequest,
  }
}
