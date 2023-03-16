<template>
  <div class="mutation-tool">
    <color-field v-model="color" :label="$t('image-editor.color-tool-lbl')" />

    <color-field
      v-model="backgroundColor"
      :label="$t('image-editor.background-color-tool-lbl')"
    />

    <color-field
      v-model="strokeColor"
      :label="$t('image-editor.stroke-color-tool-lbl')"
    />

    <range-field
      v-model="strokeWidth"
      :min="MIN_STROKE_WIDTH"
      :max="MAX_STROKE_WIDTH"
      :label="$t('image-editor.stroke-width-tool-lbl')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash'
import { ColorField, RangeField } from '@/fields'
import { EditorInstanceKey } from '@image-editor/types'
import { safeInject } from '@image-editor/helpers'

const DEFAULT_COLOR = '#000000'
const DEFAULT_BACKGROUND_COLOR = '#000000'
const DEFAULT_STROKE_COLOR = '#00000'
const DEFAULT_STROKE_WIDTH = 2
const MIN_STROKE_WIDTH = 0
const MAX_STROKE_WIDTH = 20

const color = ref(DEFAULT_COLOR)
const backgroundColor = ref(DEFAULT_BACKGROUND_COLOR)
const strokeColor = ref(DEFAULT_STROKE_COLOR)
const strokeWidth = ref(DEFAULT_STROKE_WIDTH)

const {
  instance: { setColor, setBackgroundColor, setStroke },
} = safeInject(EditorInstanceKey)

watch(
  color,
  debounce(() => {
    setColor(color.value)
  }, 100),
)

watch(
  backgroundColor,
  debounce(() => {
    setBackgroundColor(backgroundColor.value)
  }, 100),
)

watch(
  strokeColor,
  debounce(() => {
    setStroke({
      stroke: strokeColor.value,
    })
  }, 100),
)

watch(strokeWidth, () => {
  setStroke({
    strokeWidth: strokeWidth.value,
  })
})
</script>

<style scoped lang="scss">
.mutation-tool {
  display: flex;
  align-items: center;
  flex-flow: wrap column;
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
