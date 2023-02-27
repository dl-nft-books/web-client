<template>
  <div
    class="pop-up"
    ref="popUpRef"
    :class="{
      'pop-up--shown': isShown,
    }"
    :style="{
      '--pop-up-size': popUpHeight,
    }"
    :data-message="message"
    v-on="listeners"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'

import { isMobile } from '@/helpers'

defineProps<{
  message: string
}>()

const isShown = ref(false)
const popUpRef = ref<HTMLElement | null>(null)
const popUpHeight = ref('')

const showPopUp = () => (isShown.value = true)
const hidePopUp = () => (isShown.value = false)

const listeners = computed(() => ({
  mouseover: () => {
    if (isMobile()) return

    showPopUp()
  },

  mouseout: () => {
    if (isMobile()) return

    hidePopUp()
  },

  click: () => {
    if (!isMobile()) return

    showPopUp()
  },
}))

onMounted(() => {
  if (!popUpRef.value) return

  onClickOutside(popUpRef, () => {
    if (isMobile()) hidePopUp()
  })
})

const stopWatching = watch(isShown, () => {
  // Use nextTick to ensure DOM has been updated before getting pop-up height
  nextTick(() => {
    if (!popUpRef.value) return

    popUpHeight.value = window.getComputedStyle(popUpRef.value, ':after').height
    stopWatching()
  })
})
</script>

<style scoped lang="scss">
.pop-up {
  --pop-up-margin: #{toRem(10)};

  position: relative;

  &--shown {
    &:after {
      content: attr(data-message);
      position: absolute;
      background-color: var(--background-primary);
      z-index: var(--z-index-layer-2);
      width: toRem(183);
      min-height: toRem(54);
      border-radius: toRem(4);
      box-shadow: 0 toRem(6) toRem(40) rgba(var(--primary-main-rgb), 0.3);
      top: calc(-1 * var(--pop-up-size) - var(--pop-up-margin));
      left: toRem(-80);
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      padding: toRem(10);

      &:hover {
        cursor: default;
      }

      animation: slide-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
  }

  &:hover {
    cursor: pointer;
  }
}

@keyframes slide-top {
  0% {
    opacity: 0;
    transform: translateY(toRem(60));
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
