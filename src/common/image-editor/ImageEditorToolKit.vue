<template>
  <aside class="image-editor-tool-kit">
    <!-- HERE WILL BE THE LIST OF COMPONENTS 
            THAT WILL REPRESENT EACH TOOL IN EDITOR-->
    <text-tool />
    <shapes-tool />
    <mutation-tool />
    <draw-tool />
    <zoom-tool />
  </aside>
</template>

<script setup lang="ts">
import {
  TextTool,
  MutationTool,
  ZoomTool,
  DrawTool,
  ShapesTool,
} from '@image-editor/tools'
</script>
<style scoped lang="scss">
.image-editor-tool-kit {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: toRem(10);

  @include respond-to(medium) {
    justify-content: center;
    align-items: center;
    flex-flow: row wrap;
  }
}
</style>
