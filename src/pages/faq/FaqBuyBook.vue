<template>
  <div class="faq-buy-book">
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
              'faq-buy-book__phrase': text.component === 'span',
              'faq-buy-book__phrase--bold': text.isBold,
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
          :class="`faq-buy-book__image faq-buy-book__image--${image.size}`"
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
        value: t('faq-buy-book.abstract-1'),
        attrs: {},
      },
      {
        component: 'a',
        value: t('faq-buy-book.abstract-1-link'),
        attrs: {
          target: '_blank',
          href: t('faq-buy-book.abstract-1-link'),
        },
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-1-continue'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-1-acsent-word'),
        isBold: true,
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-buy-book.alt-connect-metamask'),
        src: '/images/connect-metamask.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-buy-book.abstract-2'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-2-acsent-word-1'),
        attrs: {},
        isBold: true,
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-2-continue'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-2-acsent-word-2'),
        attrs: {},
        isBold: true,
      },
    ],
    img: [
      {
        alt: t('faq-buy-book.alt-buy-book'),
        src: '/images/buy-book.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-buy-book.abstract-3'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-3-acsent-word'),
        attrs: {},
        isBold: true,
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-3-continue'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-buy-book.alt-signature'),
        src: '/images/signature.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-buy-book.abstract-4'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-4-acsent-word'),
        attrs: {},
        isBold: true,
      },
    ],
    img: [
      {
        alt: t('faq-buy-book.alt-my-nfts'),
        src: '/images/my-nfts.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-buy-book.abstract-5'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-5-acsent-word'),
        attrs: {},
        isBold: true,
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-5-continue'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: t('faq-buy-book.alt-details'),
        src: '/images/details.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: t('faq-buy-book.abstract-6'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-6-acsent-word-1'),
        attrs: {},
        isBold: true,
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-6-continue'),
        attrs: {},
      },
      {
        component: 'span',
        value: t('faq-buy-book.abstract-6-acsent-word-2'),
        attrs: {},
        isBold: true,
      },
    ],
    img: [
      {
        alt: t('faq-buy-book.alt-manual-import'),
        src: '/images/manual-import.png',
        size: 'medium',
      },
    ],
  },
]
</script>

<style scoped lang="scss">
.faq-buy-book {
  @include guide-grid;
}

.faq-buy-book__phrase {
  @include guide-phrase;
}

.faq-buy-book__image {
  @include guide-image;
}
</style>
