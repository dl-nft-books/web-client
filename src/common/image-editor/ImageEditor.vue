<template>
  <div class="image-editor">
    <div ref="editorContainerRef" class="image-editor__canvas-wrapper">
      <canvas ref="editorCanvasRef" class="image-editor__canvas" />
    </div>
    <image-editor-tool-kit />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { useImageEditor } from './composables'
import { ImageEditorToolKit } from '.'
import { EditorInstanceKey } from './types'

const props = withDefaults(
  defineProps<{
    imageUrl?: string
  }>(),
  {
    imageUrl: '/default-cover.png',
  },
)

const editorContainerRef = ref<HTMLElement | null>(null)
const editorCanvasRef = ref<HTMLCanvasElement | null>(null)

const editorInstance = useImageEditor(editorCanvasRef, editorContainerRef)

// providing canvas instance to all nested layers to avoid props drilling
provide(EditorInstanceKey, { instance: editorInstance })

const { init } = editorInstance

onMounted(() => {
  if (!editorCanvasRef.value) return

  init(props.imageUrl)
})
</script>

<style scoped lang="scss">
.image-editor {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(20) 0;
  gap: toRem(20);
  border: toRem(1) solid var(--primary-main);

  @include respond-to(medium) {
    flex-direction: column-reverse;
  }
}

.image-editor__canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: toRem(8);
  width: 100%;
  overflow-y: auto;
  min-height: toRem(700);
  padding: toRem(40);
  background-color: var(--primary-light);

  // box-shadow: inset 0 0 toRem(18) toRem(-8) rgba(0, 0, 0, 1);

  @include respond-to(small) {
    padding: toRem(20) 0;
    min-height: vh(65);
  }
}

.image-editor__canvas {
  border: toRem(1) dashed rgba(0, 0, 0, 0.2);
}
</style>
