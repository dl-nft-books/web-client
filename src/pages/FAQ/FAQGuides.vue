<template>
  <div class="faq-guides">
    <div class="faq-guides__background" />
    <section class="faq-guides__content">
      <f-a-q-guides-switcher v-model:title="guideTitle" :variants="variants" />
      <f-a-q-guide-item :title="guideTitle" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useContext } from '@/composables'
import { FAQGuidesSwitcher, FAQGuideItem } from '@/pages/FAQ'

const { $t } = useContext()

const variants = [
  $t('faq-page.guide-1.title'),
  $t('faq-page.guide-2.title'),
  $t('faq-page.guide-3.title'),
  $t('faq-page.guide-4.title'),
]

const guideTitle = ref(variants[0])
</script>

<style scoped lang="scss">
.faq-guides {
  background: var(--background-primary);
  padding: toRem(40) toRem(20);
  min-height: toRem(300);
  width: 100%;
  position: relative;
}

.faq-guides__background {
  width: 100%;
  height: vh(80);
  position: absolute;
  z-index: var(--footer-index);
  background: url('/images/cube-left.png') no-repeat left top / contain;
  background-size: 23%;
  opacity: 0.5;
  left: 0;
  top: 0;
}

.faq-guides__content {
  position: relative;
  height: fit-content;
  z-index: var(--page-index);
  display: grid;
  grid-template-columns: 30% 70%;
  justify-content: center;
  align-items: start;
  gap: toRem(40);
  padding: 0 toRem(100);

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 toRem(20);
  }
}
</style>
