<template>
  <aside class="image-editor-tool-kit">
    <!-- HERE WILL BE THE LIST OF COMPONENTS 
            THAT WILL REPRESENT EACH TOOL IN EDITOR-->
    <text-tool />
    <color-change-tool />
  </aside>
</template>

<script setup lang="ts">
import { TextTool, ColorChangeTool } from '@image-editor/tools'
</script>
<style scoped lang="scss">
.image-editor-tool-kit {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: toRem(10);

  @include respond-to(medium) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
