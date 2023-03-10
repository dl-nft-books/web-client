<template>
  <div class="draw-tool">
    <color-field
      v-model="brushColor"
      :label="$t('image-editor.brush-color-lbl')"
    />
    <range-field
      v-model="brushSize"
      :min="MIN_BRUSH_SIZE"
      :max="MAX_BRUSH_SIZE"
      :label="$t('image-editor.brush-size-lbl')"
    />
    <app-button
      class="draw-tool__button"
      scheme="default"
      icon-size="large"
      :class="{
        'draw-tool__button--picked': currentBrush === BRUSHES.pencil,
      }"
      :icon-left="$icons.pencil"
      @click="pickPencil"
    />
    <app-button
      class="draw-tool__button"
      scheme="default"
      icon-size="large"
      :class="{
        'draw-tool__button--picked': currentBrush === BRUSHES.spray,
      }"
      :icon-left="$icons.spray"
      @click="pickSpray"
    />
    <app-button
      class="draw-tool__button"
      scheme="default"
      icon-size="large"
      :class="{
        'draw-tool__button--picked': currentBrush === BRUSHES.circle,
      }"
      :icon-left="$icons.circle"
      @click="pickCircleBrush"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { AppButton } from '@/common'
import { ColorField, RangeField } from '@/fields'
import { BRUSHES, EditorInstanceKey } from '@image-editor/types'
import { safeInject } from '@image-editor/helpers'

const {
  instance: { startDraw, stopDraw, modifyBrush },
} = safeInject(EditorInstanceKey)

const MIN_BRUSH_SIZE = 1
const DEFAULT_BRUSH_SIZE = 5
const MAX_BRUSH_SIZE = 50

const isDrawing = ref(false)
const currentBrush = ref<BRUSHES>()
const brushColor = ref('#00000')
const brushSize = ref(DEFAULT_BRUSH_SIZE)

const stopDrawingMode = () => {
  if (!isDrawing.value) return

  stopDraw()
  isDrawing.value = false
  currentBrush.value = undefined
}

const startDrawindMode = (brush: BRUSHES) => {
  if (currentBrush.value === brush) {
    stopDrawingMode()
    return
  }

  isDrawing.value = true
  currentBrush.value = brush

  startDraw(brush, {
    color: brushColor.value,
    width: brushSize.value,
  })
}

const pickPencil = () => {
  startDrawindMode(BRUSHES.pencil)
}

const pickSpray = () => {
  startDrawindMode(BRUSHES.spray)
}

const pickCircleBrush = () => {
  startDrawindMode(BRUSHES.circle)
}

watch(brushSize, () => {
  modifyBrush({
    width: brushSize.value,
  })
})

watch(brushColor, () => {
  modifyBrush({
    color: brushColor.value,
  })
})
</script>

<style lang="scss" scoped>
.draw-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  gap: toRem(10);
  background-color: var(--background-primary);
  border-radius: toRem(8);
  padding: toRem(10);
  border: toRem(1) dashed var(--primary-main);

  @include respond-to(medium) {
    flex-direction: row;
  }
}

.draw-tool__button {
  aspect-ratio: 1 / 1;

  --app-button-bg-hover: var(--primary-light);
  --app-button-border-hover: var(--primary-main);

  &--picked {
    background-color: var(--primary-light);
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
