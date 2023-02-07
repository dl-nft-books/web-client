<template>
  <aside class="faq-guides-switcher">
    <a
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
    </a>
  </aside>
</template>

<script setup lang="ts">
import { GUIDES } from '@/enums'
import { Ref } from 'vue'

type Guide = {
  title: string
  value: GUIDES
}

interface GuideRef extends Ref<HTMLElement | null> {
  guideSectionRef: HTMLElement | null
}

const props = defineProps<{
  switcherList: Guide[]
  modelValue: Guide
  guideList: Array<{
    ref: GuideRef
    id: GUIDES
  }>
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: Guide): void
}>()

const pickGuide = (guide: Guide) => {
  const guideItem = props.guideList.find(item => item.id === guide.value)

  if (!guideItem?.ref.guideSectionRef) return

  guideItem.ref.guideSectionRef.scrollIntoView()
  emit('update:modelValue', guide)
}
</script>

<style scoped lang="scss">
.faq-guides-switcher {
  --button-size: #{toRem(150)};
  --mobile-background: #{rgba(var(--white-rgb), 0.6)};

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
    top: toRem(10);
    border-radius: toRem(8);
    backdrop-filter: blur(toRem(3));
    width: unset;
  }
}

.faq-guides-switcher__item {
  --bg-picked-color: #{rgba(var(--background-switcher-picked-rgb), 0.14)};

  display: grid;
  place-content: center;
  text-align: center;
  height: var(--button-size);
  justify-self: center;
  width: var(--button-size);
  border: toRem(1) solid var(--text-secondary-main);
  border-radius: toRem(5);
  background-color: var(--background-switcher);
  backdrop-filter: blur(toRem(3));
  user-select: none;
  transition: 0.2s ease-in-out;
  transition-property: border background-color;

  &:hover {
    border: toRem(1) solid var(--primary-main);
    background-color: var(--bg-picked-color);
    cursor: pointer;
  }

  &--picked {
    border: toRem(1) solid var(--primary-main);
    background-color: var(--bg-picked-color);
  }

  @include respond-to(medium) {
    height: toRem(45);
  }
}

.faq-guides-switcher__item-title {
  font-weight: 600;
  font-size: toRem(22);
  line-height: 120%;

  @include respond-to(medium) {
    font-size: toRem(14);
  }

  .faq-guides-switcher__item--picked & {
    color: var(--text-guides);
  }
}
</style>
