<template>
  <div class="animation">
    <lottie-animation
      class="no-data-message__animation"
      :animation-data="animationData"
      v-bind="$attrs"
    />
  </div>
</template>

<script lang="ts">
import { LottieAnimation } from 'lottie-web-vue'

import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'animation',
  components: { LottieAnimation },
  props: {
    animationData: {
      type: Object as PropType<JSON>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped></style>
