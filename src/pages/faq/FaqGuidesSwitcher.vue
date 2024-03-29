<template>
  <aside class="faq-guides-switcher">
    <button
      v-for="(item, index) in switcherList"
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

const props = defineProps<{
  switcherList: Guide[]
  modelValue: Guide
  guideList: Array<{
    ref: HTMLElement | null
    id: GUIDES
  }>
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: Guide): void
}>()

const pickGuide = (guide: Guide) => {
  const guideItem = props.guideList.find(item => item.id === guide.value)

  if (!guideItem?.ref) return

  guideItem.ref.scrollIntoView()
  emit('update:modelValue', guide)
}
</script>

<style scoped lang="scss">
.faq-guides-switcher {
  --button-size: #{toRem(150)};
  --mobile-background: #{rgba(var(--background-primary-light-rgb), 0.7)};

  display: grid;
  position: sticky;
  width: 100%;
  height: fit-content;
  z-index: inherit;
  top: toRem(20);
  grid-template-columns: repeat(2, var(--button-size));
  grid-template-rows: var(--button-size);
  gap: toRem(20);

  @include respond-to(medium) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: toRem(45);
    background-color: var(--mobile-background);
    padding: toRem(20);
    top: 0;
    border-radius: toRem(8);
    backdrop-filter: blur(toRem(3));
    width: unset;
  }
}

.faq-guides-switcher__item {
  --bg-picked-color: #{rgba(var(--primary-main-rgb), 0.5)};

  display: grid;
  place-content: center;
  text-align: center;
  height: var(--button-size);
  justify-self: center;
  width: var(--button-size);
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(5);
  background-color: var(--background-primary-main);
  backdrop-filter: blur(toRem(3));
  user-select: none;
  transition: 0.2s ease-in-out;
  transition-property: border background-color;
  touch-action: manipulation;

  &--picked {
    border: toRem(1) solid var(--primary-main);
    background-color: var(--bg-picked-color);
  }

  // prevent stuck hover effects on touch devices
  @media (hover: hover) {
    &:hover {
      border: toRem(1) solid var(--primary-main);
      background-color: var(--bg-picked-color);
      cursor: pointer;
    }
  }

  @include respond-to(medium) {
    height: toRem(45);
  }
}

.faq-guides-switcher__item-title {
  font-size: toRem(20);
  line-height: 120%;
  color: var(--text-primary-dark);

  @include respond-to(medium) {
    font-size: toRem(14);
  }

  .faq-guides-switcher__item--picked & {
    font-weight: 700;
    color: var(--text-primary-light);
  }
}
</style>
