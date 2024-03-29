<template>
  <div class="faq-page">
    <header class="faq-page__head">
      <h1 class="faq-page__title">
        {{ $t('faq-page.title') }}
      </h1>
    </header>
    <section class="faq-page__overview">
      <div>
        <h4 class="faq-page__overview-title">
          {{ $t('faq-page.overview-title') }}
        </h4>
        <section class="faq-page__overview-info">
          <p
            v-for="(point, index) in overviewPoints"
            :key="index"
            class="faq-page__overview-point"
          >
            {{ point }}
          </p>
          <p class="faq-page__disclaimer">
            {{ $t('faq-page.overview-disclaimer') }}
          </p>
        </section>
      </div>
      <img
        class="faq-page__overview-image"
        src="/images/fancy-image.png"
        :alt="$t('faq-page.alt-fancy-image')"
      />
    </section>
    <faq-guides />
  </div>
</template>

<script setup lang="ts">
import { FaqGuides } from '@/pages/faq'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const overviewPoints = [
  t('faq-page.overview-abstract-1'),
  t('faq-page.overview-abstract-2'),
  t('faq-page.overview-abstract-3'),
]
</script>

<style scoped lang="scss">
.faq-page {
  max-width: 100%;
  padding: 0;
  background-color: var(--background-primary-dark);
}

.faq-page__title {
  margin-bottom: toRem(40);
  max-width: toRem(660);
  color: var(--text-primary-invert-main);

  @include subtitle-underline;
}

/* stylelint-disable */
.faq-page__head {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: toRem(115) var(--app-padding-right) toRem(100)
    var(--app-padding-left);
  background-image: linear-gradient(
      360deg,
      var(--background-primary-dark) 0.12%,
      rgba(var(--background-primary-dark-rgb), 0.9) 55.52%,
      rgba(var(--background-primary-dark-rgb), 0.5) 100%
    ),
    url('/images/faq-background.png');
  background-size: cover;
  background-repeat: no-repeat;

  @include respond-to(medium) {
    padding-top: toRem(40);
    padding-bottom: 0;
  }
}
/* stylelint-enable */

.faq-page__overview {
  display: flex;
  justify-content: space-between;
  gap: toRem(90);
  padding: toRem(40) toRem(100);

  @include respond-to(medium) {
    flex-direction: column;
    padding: 0 toRem(60);
  }
}

.faq-page__overview-title {
  color: var(--primary-main);
  margin-bottom: toRem(20);
  margin-top: toRem(60);
  font-weight: 700;

  @include respond-to(medium) {
    margin-top: toRem(20);
  }
}

.faq-page__overview-info {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
  position: relative;

  &:before {
    position: absolute;
    left: toRem(-145);
    top: toRem(115);
    content: '';
    height: toRem(2);
    background: var(--background-primary);
    width: toRem(235);
    transform: rotate(90deg);
  }
}

.faq-page__overview-point {
  font-size: toRem(16);
  line-height: 120%;
  color: var(--text-primary-invert-main);
}

.faq-page__disclaimer {
  font-size: toRem(16);
  line-height: 120%;
  color: var(--text-diclaimer);
  font-style: italic;

  &:before {
    content: '•';
    padding: toRem(10);
  }
}

.faq-page__overview-image {
  width: clamp(toRem(50), 70%, toRem(400));
  margin: 0 auto;
  padding-bottom: toRem(40);
  object-fit: contain;
  background-size: contain;
}
</style>
