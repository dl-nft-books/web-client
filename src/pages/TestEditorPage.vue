<template>
  <div class="test-editor-page">
    <image-editor ref="editorInstance" :image-url="testImage" />
    <app-button :text="'DOWNLOAD'" @click="download" />
  </div>
</template>

<script setup lang="ts">
import 'simple-fabric-vue-image-editor/dist/fabric-vue-image-editor-ts.css'
import { ImageEditor, UseImageEditor } from 'simple-fabric-vue-image-editor'
import { ref } from 'vue'
import { AppButton } from '@/common'

const testImage =
  'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/f6391766-11b1-48cf-aa55-811948c26bd9.png'

const editorInstance = ref<{
  editorInstance: UseImageEditor | null
}>()

const download = () => {
  if (!editorInstance.value) return

  const { editorInstance: editor } = editorInstance.value

  if (!editor) return

  editor.download()
}
</script>

<style scoped lang="scss">
.test-editor-page {
  height: vh(60);
  flex: 1;
  width: 80%;
  margin: 0 auto;
}
</style>
