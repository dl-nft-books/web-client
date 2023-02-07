<template>
  <div class="faq-guide-item">
    <h3 class="faq-guide-item__title">
      {{ guide.title }}
    </h3>
    <component :is="currentGuide" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  FaqMetamask,
  FaqBuyBook,
  FaqMobileVersion,
  FaqSolveProblems,
} from '@/pages/faq'

import { GUIDES } from '@/enums'

const props = defineProps<{
  guide: {
    title: string
    value: GUIDES
  }
}>()

const currentGuide = computed(() => {
  switch (props.guide.value) {
    case GUIDES.buyBook:
      return FaqBuyBook
    case GUIDES.mobile:
      return FaqMobileVersion
    case GUIDES.problems:
      return FaqSolveProblems
    case GUIDES.metamask:
    default:
      return FaqMetamask
  }
})
</script>

<style scoped lang="scss">
.faq-guide-item {
  padding-left: toRem(80);
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  width: 100%;

  @include respond-to(medium) {
    padding-left: 0;
  }
}

.faq-guide-item__title {
  font-weight: 700;
  font-size: toRem(24);
  line-height: toRem(30);
  text-transform: uppercase;
  position: relative;

  &:after {
    content: ' ';
    position: absolute;
    top: toRem(30);
    left: 0;
    width: toRem(138);
    height: toRem(3);
    background-color: var(--primary-main);

    @include respond-to(small) {
      width: toRem(60);
    }
  }

  @include respond-to(medium) {
    font-size: toRem(20);
  }
}
</style>
