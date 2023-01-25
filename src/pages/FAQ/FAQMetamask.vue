<template>
  <f-a-q-card-info :order-number="1">
    <template #header>
      <p class="faq-metamask__phrase">
        {{ $t('faq-page.guide-1.abstract-1') }}
      </p>
    </template>
    <section class="faq-metamask__images">
      <div class="faq-metamask__image-wrapper">
        <img
          src="/images/metamask-mobile.png"
          class="faq-metamask__image faq-metamask__image--small"
          alt="metamask-example"
          :data-desktop-lbl="$t('faq-page.guide-1.abstract-1-desktop-lbl')"
        />
        <p class="faq-metamask__image-lbl">
          {{ $t('faq-page.guide-1.abstract-1-mobile-lbl') }}
        </p>
      </div>
      <div class="faq-metamask__image-wrapper">
        <img
          src="/images/metamask-desktop.png"
          class="faq-metamask__image faq-metamask__image--medium"
          alt="metamask-example"
        />
        <p class="faq-metamask__image-lbl">
          {{ $t('faq-page.guide-1.abstract-1-desktop-lbl') }}
        </p>
        <a :href="$t('faq-page.guide-1.abstract-1-link')" target="_blank">
          {{ $t('faq-page.guide-1.abstract-1-link') }}
        </a>
      </div>
    </section>
  </f-a-q-card-info>
  <f-a-q-card-info :order-number="2">
    <template #header>
      <div>
        <span class="faq-metamask__phrase">
          {{ $t('faq-page.guide-1.abstract-2') }}
        </span>
        <span class="faq-metamask__phrase faq-metamask__phrase--bold">
          {{ $t('faq-page.guide-1.abstract-2-acsent-word') }}
        </span>
        <span class="faq-metamask__phrase">
          {{ $t('faq-page.guide-1.abstract-2-end') }}
        </span>
      </div>
    </template>
  </f-a-q-card-info>
  <f-a-q-card-info :order-number="3">
    <template #header>
      <div>
        <p class="faq-metamask__phrase">
          {{ $t('faq-page.guide-1.abstract-3') }}
        </p>
        <p class="faq-metamask__phrase faq-metamask__phrase--bold">
          {{ $t('faq-page.guide-1.subtitle-abstract-3') }}
        </p>
      </div>
    </template>
    <ul class="faq-metamask__list">
      <li class="faq-metamask__list-item">
        {{ $t('faq-page.guide-1.abstract-3-point-1') }}
      </li>
      <li class="faq-metamask__list-item">
        {{ $t('faq-page.guide-1.abstract-3-point-2') }}
      </li>
      <p
        :class="[
          'faq-metamask__phrase',
          'faq-metamask__phrase--italic',
          'faq-metamask__phrase--color-dark',
          'faq-metamask__list-item-subtitle',
        ]"
      >
        {{ $t('faq-page.guide-1.abstract-3-point-2-subtitle') }}
      </p>
      <li class="faq-metamask__list-item">
        {{ $t('faq-page.guide-1.abstract-3-point-3') }}
      </li>
      <p
        :class="[
          'faq-metamask__phrase',
          'faq-metamask__phrase--italic',
          'faq-metamask__phrase--color-dark',
          'faq-metamask__list-item-subtitle',
        ]"
      >
        {{ $t('faq-page.guide-1.abstract-3-point-3-subtitle') }}
      </p>
    </ul>
  </f-a-q-card-info>
  <f-a-q-card-info :order-number="4">
    <template #header>
      <div>
        <span class="faq-metamask__phrase">
          {{ $t('faq-page.guide-1.abstract-4') }}
        </span>
        <span class="faq-metamask__phrase faq-metamask__phrase--bold">{{
          $t('faq-page.guide-1.abstract-4-acsent-word')
        }}</span>
      </div>
    </template>
    <div class="faq-metamask__image-wrapper">
      <img
        src="/images/metamask-portfolio.png"
        class="faq-metamask__image faq-metamask__image--medium"
        alt="metamask-portfolio"
      />
    </div>
  </f-a-q-card-info>
</template>

<script setup lang="ts">
import { FAQCardInfo } from '@/pages/FAQ'
</script>

<style scoped lang="scss">
.faq-metamask__images {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(20) toRem(40);

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
  position: relative;
  width: fit-content;
}

.faq-metamask__image {
  background-size: contain;

  &--small {
    width: clamp(toRem(50), 60%, toRem(200));
  }

  &--medium {
    width: clamp(toRem(200), 100%, toRem(500));
  }
}

.faq-metamask__image-lbl {
  font-style: italic;
  font-size: toRem(14);
  line-height: 120%;
}

.faq-metamask__phrase {
  line-height: 130%;

  &--bold {
    font-weight: 600;
  }

  &--italic {
    font-style: italic;
  }

  &--color-dark {
    color: var(--primary-dark);
  }
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
