<template>
  <div class="color-change-tool">
    <input
      class="color-change-tool__color-picker"
      v-model="color"
      type="color"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { EditorInstanceKey } from '@image-editor/types'
import { safeInject } from '@image-editor/helpers'

const DEFAULT_COLOR = 'black'

const color = ref(DEFAULT_COLOR)

const {
  instance: { setColor },
} = safeInject(EditorInstanceKey)

watch(color, () => {
  setColor(color.value)
})
</script>

<style scoped lang="scss">
.color-change-tool__color-picker {
  --size: #{toRem(40)};

  width: var(--size);
  height: var(--size);
  background-color: transparent;
  border: none;
  cursor: pointer;

  &::-webkit-color-swatch {
    border-radius: toRem(8);
    border: toRem(2) solid var(--primary-main);
  }
}
</style>
