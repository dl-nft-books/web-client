<template>
  <div class="faq-solve-problems">
    <faq-card-info
      v-for="(item, index) in guideInfo"
      :key="index"
      :order-number="index + 1"
      :modification="index === guideInfo.length - 1 ? 'col-span' : 'default'"
    >
      <template #header>
        <div>
          <component
            v-for="text in item.text"
            :is="text.component"
            :key="text.value"
            v-bind="text.attrs"
            :class="{
              'faq-solve-problems__phrase': text.component === 'span',
              'faq-solve-problems__phrase--bold': text.isBold,
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
            'faq-solve-problems__image',
            `faq-solve-problems__image--${image.size}`,
          ]"
          :src="image.src"
          :alt="image.alt"
        />
      </template>
    </faq-card-info>
  </div>
</template>

<script setup lang="ts">
import { useContext } from '@/composables'
import { FaqCardInfo } from '@/pages/faq'
import { GuideInfo } from '@/types'

const { $t } = useContext()

const guideInfo: GuideInfo[] = [
  {
    text: [
      {
        component: 'span',
        value: $t('faq-solve-problems.abstract-1'),
        attrs: {},
      },
      {
        component: 'span',
        value: $t('faq-solve-problems.abstract-1-acsent-word'),
        isBold: true,
        attrs: {},
      },
      {
        component: 'span',
        value: $t('faq-solve-problems.abstract-1-continue'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: $t('faq-solve-problems.alt-gas-control'),
        src: '/images/gas-control.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: $t('faq-solve-problems.abstract-2-acsent-word'),
        isBold: true,
        attrs: {},
      },
      {
        component: 'span',
        value: $t('faq-solve-problems.abstract-2'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: $t('faq-solve-problems.alt-transaction-retry'),
        src: '/images/transaction-retry.png',
        size: 'medium',
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: $t('faq-solve-problems.abstract-3-acsent-word'),
        isBold: true,
        attrs: {},
      },
      {
        component: 'span',
        value: $t('faq-solve-problems.abstract-3'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: $t('faq-solve-problems.alt-increase-fee'),
        src: '/images/increase-fee.png',
        size: 'medium',
      },
    ],
  },
]
</script>

<style scoped lang="scss">
.faq-solve-problems {
  @include guide-grid;
}

.faq-solve-problems__phrase {
  @include guide-phrase;
}

.faq-solve-problems__image {
  @include guide-image;
}
</style>
