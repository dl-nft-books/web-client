<template>
  <div class="test-editor-page">
    <image-editor />
  </div>
</template>

<script setup lang="ts">
import { ImageEditor } from '@/common'
</script>

<style scoped lang="scss">
.test-editor-page {
  height: vh(60);
  flex: 1;
  width: 80%;
  margin: 0 auto;
}
</style>
