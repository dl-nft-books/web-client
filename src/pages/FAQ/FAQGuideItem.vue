<template>
  <div class="faq-guide-item">
    <h3 class="faq-guide-item__title">
      {{ title }}
    </h3>
    <f-a-q-metamask v-if="title === $t('faq-page.guide-1.title')" />
    <f-a-q-buy-book v-if="title === $t('faq-page.guide-2.title')" />
    <f-a-q-mobile-version v-if="title === $t('faq-page.guide-3.title')" />
    <f-a-q-solve-problems v-if="title === $t('faq-page.guide-4.title')" />
  </div>
</template>

<script setup lang="ts">
import {
  FAQMetamask,
  FAQBuyBook,
  FAQMobileVersion,
  FAQSolveProblems,
} from '@/pages/FAQ'

defineProps<{
  title: string
}>()
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
      top: toRem(40);
    }
  }

  @include respond-to(medium) {
    font-size: toRem(20);
  }
}
</style>
