<template>
  <div class="faq-mobile-version">
    <faq-card-info
      v-for="(item, index) in guideInfo"
      :key="index"
      :order-number="index + 1"
    >
      <template #header>
        <div>
          <component
            v-for="text in item.text"
            :is="text.component"
            :key="text.value"
            v-bind="text.attrs"
            :class="{
              'faq-mobile-version__phrase': text.component !== 'a',
              'faq-mobile-version__phrase--bold': text.isBold,
            }"
          >
            {{ text.value }}
          </component>
        </div>
      </template>
      <template v-if="item.img">
        <img
          v-for="image in item.img"
          :key="image.alt"
          :class="[
            'faq-mobile-version__image',
            `faq-mobile-version__image--${image.size}`,
          ]"
          :src="image.src"
          :alt="image.alt"
        />
      </template>
    </faq-card-info>
  </div>
</template>

<script setup lang="ts">
import { FaqCardInfo } from '@/pages/faq'
import { GuideInfo } from '@/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const guideInfo: GuideInfo[] = [
  {
    text: [
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-1'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-1-acsent-word'),
        isBold: true,
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-1-continue'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-mobile-version.alt-mobile-bookshelf'),
        src: '/images/mobile-bookshelf.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'p',
        value: t('faq-mobile-version.abstract-2'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-mobile-version.alt-mobile-generation'),
        src: '/images/mobile-generation.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'p',
        value: t('faq-mobile-version.abstract-3'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-mobile-version.alt-mobile-payment'),
        src: '/images/mobile-payment.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-4'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-4-acsent-word'),
        isBold: true,
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-mobile-version.alt-activity-tab'),
        src: '/images/activity-tab.png',
        size: 'small',
      },
    ],
  },
  {
    text: [
      {
        component: 'p',
        value: t('faq-mobile-version.abstract-5'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-mobile-version.alt-block-explorer'),
        src: '/images/block-explorer.png',
        size: 'small',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-6'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-6-acsent-word-1'),
        isBold: true,
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-6-continue'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-6-acsent-word-2'),
        isBold: true,
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-6-end'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-mobile-version.alt-transaction-action'),
        src: '/images/transaction-action.png',
        size: 'small',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-7'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-7-acsent-word'),
        isBold: true,
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-7-continue'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-mobile-version.alt-import-nfts'),
        src: '/images/import-nfts.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-8'),
        attrs: {},
      },
      {
        component: 'a',
        value: t('faq-mobile-version.abstract-8-link'),
        attrs: {
          href: t('faq-mobile-version.abstract-8-link'),
          target: '_blank',
        },
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-8-continue'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-8-acsent-word'),
        isBold: true,
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-mobile-version.abstract-8-end'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-mobile-version.alt-mobile-details'),
        src: '/images/mobile-details.png',
        size: 'small',
      },
    ],
  },
]
</script>

<style scoped lang="scss">
.faq-mobile-version {
  @include guide-grid;
}

.faq-mobile-version__phrase {
  @include guide-phrase;
}

.faq-mobile-version__image {
  @include guide-image;
}
</style>
