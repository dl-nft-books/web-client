<template>
  <div class="text-tool">
    <app-button
      :icon-left="$icons.translate"
      icon-size="large"
      @click="handleTextAdd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppButton } from '@/common'
import { EditorInstanceKey } from '../types'
import { safeInject } from '../helpers'

const DEFAULT_TEXT = 'Your unique signature'
const TEXT_COUNT_RESTRICTION = 5

const textCount = ref(0)

const {
  instance: { addText },
} = safeInject(EditorInstanceKey)

const handleTextAdd = () => {
  if (textCount.value > TEXT_COUNT_RESTRICTION) return

  addText(DEFAULT_TEXT)
  textCount.value++
}
</script>

<style scoped lang="scss"></style>
