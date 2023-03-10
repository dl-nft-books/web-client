<template>
  <div class="color-change-tool">
    <color-field v-model="color" :label="$t('image-editor.color-tool-lbl')" />

    <color-field
      v-model="backgroundColor"
      :label="$t('image-editor.background-color-tool-lbl')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ColorField } from '@/fields'
import { EditorInstanceKey } from '@image-editor/types'
import { safeInject } from '@image-editor/helpers'

const DEFAULT_COLOR = '#000000'
const DEFAULT_BACKGROUND_COLOR = '#000000'

const color = ref(DEFAULT_COLOR)
const backgroundColor = ref(DEFAULT_BACKGROUND_COLOR)

const {
  instance: { setColor, setBackgroundColor },
} = safeInject(EditorInstanceKey)

watch(color, () => {
  setColor(color.value)
})

watch(backgroundColor, () => {
  setBackgroundColor(backgroundColor.value)
})
</script>

<style scoped lang="scss">
.color-change-tool {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: toRem(10);
  background-color: var(--background-primary);
  border-radius: toRem(8);
  padding: toRem(10);
  border: toRem(1) dashed var(--primary-main);

  @include respond-to(medium) {
    flex-direction: row;
  }
}
</style>
