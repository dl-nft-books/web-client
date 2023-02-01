<template>
  <aside class="faq-guides-switcher">
    <button
      v-for="(item, index) in variants"
      :key="index"
      class="faq-guides-switcher__item"
      :class="{
        'faq-guides-switcher__item--picked': modelValue.value === item.value,
      }"
      @click="pickGuide(item)"
    >
      <p class="faq-guides-switcher__item-title">
        {{ item.title }}
      </p>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { GUIDES } from '@/enums'

type Guide = {
  title: string
  value: GUIDES
}

defineProps<{
  variants: Guide[]
  modelValue: Guide
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: Guide): void
}>()

const pickGuide = (guide: Guide) => {
  emit('update:modelValue', guide)
}
</script>

<style scoped lang="scss">
.faq-guides-switcher {
  --button-size: #{toRem(150)};

  display: grid;
  position: sticky;
  width: 100%;
  height: fit-content;
  top: 0;
  grid-template-columns: repeat(2, var(--button-size));
  grid-template-rows: var(--button-size);
  gap: toRem(20);

  @include respond-to(medium) {
    grid-template-columns: repeat(auto-fit, minmax(var(--button-size), 1fr));
  }

  @include respond-to(small) {
    grid-template-columns: repeat(2, var(--button-size));
    grid-template-rows: toRem(45);
    width: unset;
  }
}

.faq-guides-switcher__item {
  --bg-picked-color: #{rgba(var(--background-switcher-picked-rgb), 0.14)};

  height: var(--button-size);
  justify-self: center;
  width: var(--button-size);
  border: toRem(1) solid var(--text-secondary-main);
  border-radius: toRem(5);
  background-color: var(--background-switcher);
  backdrop-filter: blur(toRem(3));
  transition: 0.2s ease-in-out;
  transition-property: border background-color;

  &:hover {
    border: toRem(1) solid var(--primary-main);
    background-color: var(--bg-picked-color);
  }

  &--picked {
    border: toRem(1) solid var(--primary-main);
    background-color: var(--bg-picked-color);
  }

  @include respond-to(small) {
    height: toRem(45);
  }
}

.faq-guides-switcher__item-title {
  font-weight: 600;
  font-size: toRem(22);
  line-height: 120%;

  @include respond-to(small) {
    font-size: toRem(14);
  }

  .faq-guides-switcher__item--picked & {
    color: var(--text-guides);
  }
}
</style>
