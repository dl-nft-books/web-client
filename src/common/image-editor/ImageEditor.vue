<template>
  <div ref="editorContainerRef" class="image-editor">
    <canvas ref="editorCanvasRef" class="image-editor__canvas" />
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
  overflow-y: auto;
  min-height: toRem(700);

  @include respond-to(medium) {
    flex-direction: column-reverse;
    min-height: fit-content;
  }
}

.image-editor__canvas {
  border-radius: toRem(8);
  padding: toRem(10);
  box-shadow: inset 0 0 toRem(18) toRem(-8) rgba(0, 0, 0, 0.5);
}
</style>
