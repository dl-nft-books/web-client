<template>
  <div class="shapes-tool">
    <app-button
      class="shapes-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.cube"
      @click="handleRectAdd"
    />
    <app-button
      class="shapes-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.chartPie"
      @click="handleTriangleAdd"
    />
    <app-button
      class="shapes-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.infoCircle"
      @click="handleCircleAdd"
    />
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { EditorInstanceKey } from '@image-editor/types'
import { safeInject } from '@image-editor/helpers'
import { ErrorHandler } from '@/helpers'

enum SHAPES {
  rectangle = 'rect',
  triangle = 'triangle',
  circle = 'circle',
}
const {
  instance: { addRectangle, addTriangle, addCircle },
} = safeInject(EditorInstanceKey)

const handleShapeAdd = (shape: SHAPES) => {
  try {
    switch (shape) {
      case SHAPES.rectangle:
        addRectangle()
        break
      case SHAPES.circle:
        addCircle()
        break
      case SHAPES.triangle:
      default:
        addTriangle()
        break
    }
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handleRectAdd = () => {
  handleShapeAdd(SHAPES.rectangle)
}

const handleTriangleAdd = () => {
  handleShapeAdd(SHAPES.triangle)
}

const handleCircleAdd = () => {
  handleShapeAdd(SHAPES.circle)
}
</script>

<style scoped lang="scss">
.shapes-tool {
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

.shapes-tool__button {
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
