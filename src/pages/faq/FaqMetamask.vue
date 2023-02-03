<template>
  <div class="faq-metamask">
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
              'faq-metamask__phrase': text.component !== 'a',
              'faq-metamask__phrase--bold': text.isBold,
            }"
          >
            {{ text.value }}
          </component>
        </div>
      </template>
      <section v-if="item.img" class="faq-metamask__images">
        <div
          v-for="image in item.img"
          :key="image.alt"
          class="faq-metamask__image-wrapper"
        >
          <img
            :src="image.src"
            :class="`faq-metamask__image faq-metamask__image--${image.size}`"
            :alt="image.alt"
          />
          <p v-if="image.label" class="faq-metamask__image-lbl">
            {{ image.label }}
          </p>
        </div>
      </section>
      <faq-metamask-list v-if="item.hasList" />
    </faq-card-info>
  </div>
</template>

<script setup lang="ts">
import { FaqCardInfo, FaqMetamaskList } from '@/pages/faq'
import { useContext } from '@/composables'
import { GuideInfo } from '@/types'

const { $t } = useContext()

const guideInfo: GuideInfo[] = [
  {
    text: [
      {
        component: 'p',
        value: $t('faq-metamask.abstract-1'),
        attrs: {},
      },
    ],
    img: [
      {
        alt: $t('faq-metamask.alt-metamask-mobile'),
        src: '/images/metamask-mobile.png',
        size: 'x-small',
        label: $t('faq-metamask.abstract-1-mobile-lbl'),
      },
      {
        alt: $t('faq-metamask.alt-metamask-desktop'),
        src: '/images/metamask-desktop.png',
        size: 'medium',
        label: $t('faq-metamask.abstract-1-desktop-lbl'),
      },
    ],
  },
  {
    text: [
      {
        component: 'span',
        value: $t('faq-metamask.abstract-2'),
        attrs: {},
      },
      {
        component: 'span',
        value: $t('faq-metamask.abstract-2-acsent-word'),
        attrs: {},
        isBold: true,
      },
      {
        component: 'span',
        value: $t('faq-metamask.abstract-2-end'),
        attrs: {},
      },
    ],
  },
  {
    text: [
      {
        component: 'p',
        value: $t('faq-metamask.abstract-3'),
        attrs: {},
      },
      {
        component: 'p',
        value: $t('faq-metamask.subtitle-abstract-3'),
        attrs: {},
        isBold: true,
      },
    ],
    hasList: true,
  },
  {
    text: [
      {
        component: 'span',
        value: $t('faq-metamask.abstract-4'),
        attrs: {},
      },
      {
        component: 'span',
        value: $t('faq-metamask.abstract-4-acsent-word'),
        attrs: {},
        isBold: true,
      },
    ],
    img: [
      {
        alt: $t('faq-metamask.alt-metamask-portfolio'),
        src: '/images/metamask-portfolio.png',
        size: 'medium',
      },
    ],
  },
]
</script>

<style scoped lang="scss">
.faq-metamask {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.faq-metamask__images {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(10) toRem(40);

  @include respond-to(small) {
    flex-direction: column;
    gap: toRem(30);
  }
}

.faq-metamask__image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: toRem(10);
  width: fit-content;
}

.faq-metamask__image {
  @include guide-image;
}

.faq-metamask__image-lbl {
  font-style: italic;
  font-size: toRem(14);
  line-height: 120%;
}

.faq-metamask__phrase {
  @include guide-phrase;
}

.faq-metamask__list {
  padding-left: toRem(40);
}

.faq-metamask__list-item {
  &:before {
    content: '•';
    position: relative;
    color: var(--primary-main);
    top: toRem(5);
    padding-right: toRem(10);
    font-size: toRem(30);
  }
}

.faq-metamask__list-item-subtitle {
  padding-left: toRem(18);
  padding-top: toRem(5);
}
</style>
