<template>
  <div class="faq-guide-item">
    <h3 class="faq-guide-item__title">
      {{ title }}
    </h3>
  </div>
</template>

<script setup lang="ts">
// import { useContext } from '@/composables'

defineProps<{
  title: string
}>()

// const { $t } = useContext()

// const getGuideAssetFromTitle = (title: string): string[] => {
//   switch (title) {
//     case $t('faq-page.guide-1.title'):
//       ;[$t()]
//   }
// }
</script>

<style scoped lang="scss">
.faq-guide-item__title {
  margin-left: toRem(80);
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
