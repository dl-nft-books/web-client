import { Task } from '@/types'
import { getTaskById } from '@/api'

/* Not used anywhere but here, no need to create seperate file */
enum TaskStatus {
  pending = 1,
  generating = 2,
  finishedGeneration = 3,
  uploading = 4,
  finishedUploading = 5,
}

const CALL_INTERVAL = 3000 // ms

export async function untilTaskFinishedGeneration(
  id: string | number,
): Promise<Task | undefined> {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const { data: task } = await getTaskById(id)

        if (task.status === TaskStatus.finishedGeneration) {
          clearInterval(intervalId)
          resolve(task)
        }
      } catch (error) {
        clearInterval(intervalId)
        reject(error)
      }
    }, CALL_INTERVAL)
  })
}
