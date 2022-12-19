<template>
  <div ref="rootEl" :style="cssVars">
    <slot name="head" :menu="exposedMenuObject" />
    <transition
      name="drop-down_transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div class="drop-down__body" v-show="isOpen">
        <slot :menu="exposedMenuObject" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ref, onMounted } from 'vue'

interface Props {
  top?: number
  right?: number
}

const props = withDefaults(defineProps<Props>(), {
  top: 60,
  right: -10,
})

const cssVars = computed(() => ({
  '--dropdown-top': `${props.top}px`,
  '--dropdown-right': `${props.right}px`,
}))

const rootEl = ref<HTMLElement | null>(null)
const isOpen = ref<boolean>(false)

const exposedMenuObject = {
  isOpen,
  toggle: () => {
    isOpen.value = !isOpen.value
  },
  open: () => {
    isOpen.value = true
  },
  close: () => {
    isOpen.value = false
  },
}

onMounted(() => {
  if (rootEl.value) {
    onClickOutside(rootEl, () => {
      isOpen.value = false
    })
  }
})

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--dropdown-body-height',
    `${element.scrollHeight}px`,
  )
}
</script>

<style lang="scss" scoped>
.drop-down__body {
  position: absolute;
  top: var(--dropdown-top);
  right: var(--dropdown-right);
  border-radius: toRem(8);
  width: fit-content;
  box-shadow: 0 toRem(4) toRem(11) rgba(var(--drop-down-shadow-rgb), 0.25);
  overflow: hidden;
}

.drop-down_transition-enter-active {
  animation: appear-animation 0.3s ease-in-out;
}

.drop-down_transition-leave-active {
  animation: appear-animation 0.3s ease-in-out reverse;
}

@keyframes appear-animation {
  0% {
    opacity: 0;
    height: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    height: var(--dropdown-body-height);
  }
}
</style>
