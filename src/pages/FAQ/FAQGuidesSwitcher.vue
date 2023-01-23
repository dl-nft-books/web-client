<template>
  <div class="faq-guides-switcher">
    <button
      v-for="(variant, i) in variants"
      :key="i"
      class="faq-guides-switcher__item"
      :class="{ 'faq-guides-switcher__item--picked': title === variant }"
      @click="pickGuide(variant)"
    >
      <p class="faq-guides-switcher__item-title">
        {{ variant }}
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  variants: string[]
  title: string
}>()

const emit = defineEmits<{
  (event: 'update:title', value: string): void
}>()

const pickGuide = (guideTitle: string) => {
  emit('update:title', guideTitle)
}
</script>

<style scoped lang="scss">
.faq-guides-switcher {
  --button-size: #{toRem(173)};

  display: grid;
  position: sticky;
  top: 0;
  grid-template-columns: repeat(2, var(--button-size));
  gap: toRem(20);
}

.faq-guides-switcher__item {
  height: var(--button-size);
  width: var(--button-size);
  border: toRem(1) solid var(--text-secondary-main);
  border-radius: toRem(5);
  background-color: var(--background-switcher);
  backdrop-filter: blur(toRem(3));
  transition: 0.2s ease-in-out;
  transition-property: border background-color;

  &:hover {
    border: toRem(1) solid var(--primary-main);
    background-color: rgba(var(--background-switcher-picked-rgb), 0.14);
  }

  &--picked {
    border: toRem(1) solid var(--primary-main);
    background-color: rgba(var(--background-switcher-picked-rgb), 0.14);
  }
}

.faq-guides-switcher__item-title {
  font-weight: 600;
  font-size: toRem(22);
  line-height: 120%;

  .faq-guides-switcher__item--picked & {
    color: var(--text-guides);
  }
}
</style>
