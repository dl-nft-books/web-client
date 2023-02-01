<template>
  <div :class="classes">
    <header class="faq-card-info__header">
      <div class="faq-card-info__number">
        <p class="faq-card-info__number-content">
          {{ orderNumber }}
        </p>
      </div>
      <slot name="header" />
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type MODIFICATIONS = 'col-span' | 'default'

const props = withDefaults(
  defineProps<{
    orderNumber: number
    modification?: MODIFICATIONS
  }>(),
  { modification: 'default' },
)

const classes = computed(() => [
  'faq-card-info',
  `faq-card-info--${props.modification}`,
])
</script>

<style scoped lang="scss">
.faq-card-info {
  --background-color: #{rgba(var(--guide-card-color-rgb), 0.1)};

  display: flex;
  flex-direction: column;
  gap: toRem(15);
  width: 100%;
  max-width: toRem(800);
  border-radius: toRem(12);
  background-color: var(--background-color);
  padding: toRem(20);

  &--col-span {
    grid-column: span 2;
    max-width: unset;
  }
}

.faq-card-info__header {
  display: flex;
  gap: toRem(12);
}

.faq-card-info__number {
  --size: #{toRem(25)};

  width: var(--size);
  height: var(--size);
  border-radius: 100%;
  background-color: var(--background-quinary);
  display: grid;
  place-content: center;
  padding-top: toRem(2);
  aspect-ratio: 1 / 1;
}

.faq-card-info__number-content {
  color: var(--text-primary-invert-main);
  font-weight: 700;
  font-size: toRem(14);
  line-height: 120%;
}
</style>
