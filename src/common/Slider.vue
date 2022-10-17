<script lang="ts" setup>
import { Icon } from '@/common'

const EVENTS = {
  nextPage: 'next-page',
  previousPage: 'previous-page',
}

withDefaults(
  defineProps<{
    isArrowsShown?: boolean
  }>(),
  {
    isArrowsShown: true,
  },
)
</script>

<template>
  <div class="slider">
    <button
      v-if="isArrowsShown"
      class="
        slider__navigation
        slider__navigation--left
      "
      @click.prevent="$emit(EVENTS.previousPage)"
    >
      <icon
        class="slider__navigation-icon"
        :name="$icons.sliderArrow"
      />
    </button>
    <div class="slider-content">
      <slot />
    </div>
    <button
      v-if="isArrowsShown"
      class="slider__navigation"
      @click.prevent="$emit(EVENTS.nextPage)"
    >
      <icon
        class="slider__navigation-icon"
        :name="$icons.sliderArrow"
      />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.slider {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: toRem(40);
}

.slider-content {
  display: flex;
  justify-content: space-around;
  width: 100%;

  @include respond-to(medium) {
    display: flex;
  }
}

.slider__navigation {
  margin: auto toRem(60) auto toRem(30);
  width: toRem(18);
  height: toRem(31);

  &--left {
    margin: auto toRem(30) auto toRem(60);
    transform: rotate(180deg);
  }
}

.slider__dots {
  position: absolute;
  bottom: toRem(-40);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

.slider__dots-item {
  width: toRem(8);
  height: toRem(8);
  border-radius: 50%;
  cursor: pointer;

  &:not(:last-child) {
    margin-right: toRem(10);
  }
}

.slider__dots-item--active {
  width: toRem(14);
  height: toRem(14);
  background: inherit;
}

.slider__navigation-button {
  position: absolute;
  right: 0;
  bottom: toRem(-40);
}

.slider__navigation-icon {
  color: var(--text-primary-invert-main);
}
</style>
