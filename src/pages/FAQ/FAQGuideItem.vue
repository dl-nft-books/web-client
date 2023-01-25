<template>
  <div class="faq-guide-item">
    <h3 class="faq-guide-item__title">
      {{ title }}
    </h3>
    <f-a-q-metamask v-if="title === $t('faq-page.guide-1.title')" />
  </div>
</template>

<script setup lang="ts">
// import { useContext } from '@/composables'
import { FAQMetamask } from '@/pages/FAQ'

defineProps<{
  title: string
}>()

// const { $t } = useContext()

// const getGuideAssetFromTitle = (title: string): string[] => {
//   switch (title) {
//     case $t('faq-page.guide-1.title'):
//       return [
//         $t('faq-page.guide-1.abstract-1'),
//         $t('faq-page.guide-1.abstract-2'),
//         $t('faq-page.guide-1.abstract-2-acsent-word'),
//         $t('faq-page.guide-1.abstract-2-end'),
//       ]
//     default:
//       return []
//   }
// }
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
