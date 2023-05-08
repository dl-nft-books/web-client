<template>
  <div ref="marqueeRef" class="marquee">
    <ul class="marquee__wrapper">
      <template v-for="(item, index) in textArray" :key="index">
        <li class="marquee__text">
          {{ item }}
        </li>
        <li class="marquee__delimiter" />
      </template>
    </ul>

    <!-- For infinite scrolling we need to dublicate text -->
    <ul class="marquee__wrapper" aria-hidden="true">
      <template v-for="(item, index) in textArray" :key="index">
        <li class="marquee__text">
          {{ item }}
        </li>
        <li class="marquee__delimiter" />
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getTextWidth, getCanvasFont } from '@/helpers'

const props = defineProps<{
  text: string[]
}>()

const marqueeRef = ref<HTMLElement | null>(null)

const countLength = (text: string) =>
  parseInt(getTextWidth(text, getCanvasFont(marqueeRef.value)).toFixed())

const textArray = computed(() => {
  if (!marqueeRef.value?.clientWidth) return props.text

  let formattedTextArray = [...props.text]

  let formattedTextLength = countLength(formattedTextArray.join(' '))

  while (formattedTextLength < marqueeRef.value?.clientWidth) {
    formattedTextArray = [...formattedTextArray, ...props.text]
    formattedTextLength = countLength(formattedTextArray.join(' '))
  }

  return formattedTextArray
})
</script>

<style scoped lang="scss">
.marquee {
  --gap: #{toRem(15)};

  border-top: toRem(1) solid var(--border-primary-light);
  border-bottom: toRem(1) solid var(--border-primary-light);
  overflow: hidden;
  height: toRem(35);
  display: flex;
  user-select: none;
}

.marquee__wrapper {
  animation: marquee-animation 10s linear infinite;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  justify-content: space-around;
  align-items: center;
  gap: var(--gap);
  margin-right: var(--gap);
  min-width: 100%;
}

.marquee__delimiter {
  width: toRem(6);
  height: toRem(6);
  background-color: var(--border-primary-light);
}

.marquee__text {
  color: var(--text-primary-dark);
  font-style: italic;
}

@keyframes marquee-animation {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
}
</style>
