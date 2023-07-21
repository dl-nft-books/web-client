<template>
  <teleport :to="to" v-if="isMounted">
    <slot />
  </teleport>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { sleep, ErrorHandler } from '@/helpers'

const MAX_RETRIES = 10
const DEFAULT_RETRY_INTERVAL = 100

const props = defineProps<{ to: string }>()

const isMounted = ref(false)

const waitUntilTargetMounted = async (retryDelay = DEFAULT_RETRY_INTERVAL) => {
  let teleportTarget = document.querySelector(props.to)
  let tryNumber = 0

  while (!teleportTarget) {
    if (tryNumber > MAX_RETRIES) throw new Error('No node with such id found')

    teleportTarget = document.querySelector(props.to)

    if (teleportTarget) break

    tryNumber++
    await sleep(retryDelay)
  }
}

onMounted(async () => {
  try {
    await waitUntilTargetMounted()

    isMounted.value = true
  } catch (error) {
    ErrorHandler.process(error)
  }
})
</script>
