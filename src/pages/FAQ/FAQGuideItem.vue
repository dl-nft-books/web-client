<template>
  <div class="faq-guide-item">
    <h3 class="faq-guide-item__title">
      {{ title }}
    </h3>
    <f-a-q-card-info :order-number="1">
      <template #header>
        <p class="faq-guide-item__phrase">
          {{ $t('faq-page.guide-1.abstract-1') }}
        </p>
      </template>
      <div class="faq-guide-item__image-wrapper">
        <img
          src="/images/metamask-desktop.png"
          class="faq-guide-item__image faq-guide-item__image--medium"
          alt="metamask-example"
        />
        <p class="faq-guide-item__image-lbl">
          {{ $t('faq-page.guide-1.abstract-1-desktop-lbl') }}
        </p>
        <a :href="$t('faq-page.guide-1.abstract-1-link')" target="_blank">
          {{ $t('faq-page.guide-1.abstract-1-link') }}
        </a>
        <div
          :class="[
            'faq-guide-item__image-wrapper',
            'faq-guide-item__image-wrapper--shifted',
          ]"
        >
          <img
            src="/images/metamask-mobile.png"
            class="faq-guide-item__image faq-guide-item__image--small"
            alt="metamask-example"
            :data-desktop-lbl="$t('faq-page.guide-1.abstract-1-desktop-lbl')"
          />
          <p class="faq-guide-item__image-lbl">
            {{ $t('faq-page.guide-1.abstract-1-mobile-lbl') }}
          </p>
        </div>
      </div>
    </f-a-q-card-info>
  </div>
</template>

<script setup lang="ts">
// import { useContext } from '@/composables'
import { FAQCardInfo } from '@/pages/FAQ'

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

.faq-guide-item__image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(10);
  position: relative;

  &--shifted {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}

.faq-guide-item__image {
  &--small {
    max-width: 40%;
  }

  &--medium {
    max-width: 70%;
  }
}

.faq-guide-item__image-lbl {
  font-style: italic;
  font-size: toRem(14);
  line-height: 120%;
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

.faq-guide-item__phrase {
  line-height: 130%;
}
</style>
