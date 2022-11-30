import { Task } from '@/types'
import { getTaskById } from '@/api'

export async function untilTaskFinishedGeneration(
  id: string | number,
): Promise<Task | undefined> {
  let response
  async function checkFinished() {
    const { data: task } = await getTaskById(id)

    // FIXME: add statuses to enum
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
