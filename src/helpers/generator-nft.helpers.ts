import { api } from '@/api'

type Task = {
  id: string
  token_id: string | number
  book_id: string
  signature: string
  ipfs_hash: string
  status: number
  file_ipfs_hash: string
  metadata_ipfs_hash: string
  uri: string
}

export async function createNewTask(opts: {
  signature: string
  account: string
  bookId: string
}) {
  const { data } = await api.post<{
    id: string
    type: string
  }>('/integrations/generator/tasks', {
    data: {
      type: 'tasks',
      attributes: {
        signature: opts.signature,
        account: opts.account,
        book_id: +opts.bookId,
      },
    },
  })

  return data
}

export async function getTaskById(id: string | number) {
  const { data } = await api.get<Task>(`/integrations/generator/tasks/${id}`)

  return data
}

export async function untilTaskFinishedGeneration(
  id: string | number,
): Promise<Task | undefined> {
  let response
  async function checkFinished() {
    const task = await getTaskById(id)

    if (task.status === 3) {
      response = task
      return
    }
    /* eslint-disable-next-line promise/avoid-new */
    await new Promise(resolve => setTimeout(resolve, 3000))
    await checkFinished()
  }

  await checkFinished()
  return response
}

export async function getPlatformsList() {
  const { data } = await api.get<
    {
      id: string
      type: string
      chain_identifier: string
      name: string
      shortname: string
    }[]
  >('/integrations/pricer/platforms')

  return data
}

export async function getPriceByPlatform(platform: string, contract?: string) {
  const { data } = await api.get<{
    id: string
    type: string
    price: string
  }>('/integrations/pricer/price', {
    platform,
    ...(contract ? { contract } : {}),
  })

  return data.price
}

export async function getMintSignature(
  platform: string,
  taskId: string | number,
  tokenAddress?: string,
) {
  const { data } = await api.get<{
    id: string
    type: string
    price: string
    signature: {
      id: string
      type: string
      end_timestamp: number
      r: string
      s: string
      v: number
    }
  }>('/integrations/generator/price', {
    platform,
    task_id: taskId,
    ...(tokenAddress ? { token_address: tokenAddress } : {}),
  })

  return data
}
