<template>
  <div class="animation">
    <lottie-animation
      class="no-data-message__animation"
      :animation-data="animationData"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'

defineProps<{
  animationData: JSON
}>()
</script>

<style lang="scss" scoped></style>
