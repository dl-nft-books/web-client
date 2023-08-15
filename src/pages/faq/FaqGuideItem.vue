<template>
  <div class="faq-guide-item">
    <h4 class="faq-guide-item__title">
      {{ guide.title }}
    </h4>
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
  display: flex;
  flex-direction: column;
  padding-left: toRem(80);
  gap: toRem(20);
  width: 100%;

  @include respond-to(medium) {
    padding-left: 0;
  }
}

.faq-guide-item__title {
  font-weight: 700;
}
</style>
