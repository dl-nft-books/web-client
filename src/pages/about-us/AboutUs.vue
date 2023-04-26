<template>
  <div class="about-us">
    <div class="about-us__head">
      <h3 class="about-us__title">
        {{ $t('about-us-page.title') }}
      </h3>
      <p class="about-us__subtitle">
        {{ $t('about-us-page.subtitle') }}
      </p>
    </div>

    <about-us-decription />

    <about-us-quote-card
      class="about-us__quote-card about-us__quote-card--with-bg"
      scheme="dark"
      :title="$t('about-us-page.founder-title')"
      :subtitle="$t('about-us-page.founder-subtitle')"
      :image="FOUNDERS_IMAGES.KRAVCHENKO"
      :quotes-list="KravchenkoQuotes"
    />

    <about-us-quote-card
      class="about-us__quote-card"
      modification="reverse"
      :title="$t('about-us-page.founder-title-2')"
      :subtitle="$t('about-us-page.founder-subtitle-2')"
      :image="FOUNDERS_IMAGES.KURBATOV"
      :quotes-list="KurbatovQuotes"
    />

    <img
      class="about-us__background about-us__background--bottom"
      src="/images/fancy-lines.png"
    />
  </div>
</template>

<script setup lang="ts">
import { AboutUsDecription, AboutUsQuoteCard } from '@/pages/about-us'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const FOUNDERS_IMAGES = {
  KURBATOV: '/images/olexandr-kurbatov.png',
  KRAVCHENKO: '/images/pavlo-kravchenko.png',
}

const KravchenkoQuotes = [t('about-us-page.founder-description')]

const KurbatovQuotes = [
  t('about-us-page.founder-description-2-abstract-1'),
  t('about-us-page.founder-description-2-abstract-2'),
  t('about-us-page.founder-description-2-abstract-3'),
  t('about-us-page.founder-description-2-abstract-4'),
]
</script>

<style lang="scss" scoped>
.about-us {
  max-width: 100%;
  padding: 0;
  background-color: var(--background-primary-dark);
  position: relative;
  z-index: var(--z-index-layer-2);
}

.about-us__quote-card {
  padding-top: toRem(140);
  padding-bottom: toRem(100);
  position: relative;

  &--with-bg {
    --bg-height: #{toRem(560)};

    &:before {
      content: '';
      position: absolute;
      top: calc(var(--bg-height) / 14);
      right: 0;
      border-radius: toRem(30) 0 0 toRem(30);
      background-color: var(--background-primary-main);
      width: 90%;
      height: var(--bg-height);

      @include respond-to(medium) {
        --bg-height: #{toRem(600)};

        width: 100%;
        border-radius: toRem(30);
      }
    }
  }
}

/* stylelint-disable */
.about-us__head {
  text-align: center;
  padding: toRem(115) var(--app-padding-right) toRem(100)
    var(--app-padding-left);
  background-image: linear-gradient(
      360deg,
      var(--background-primary-dark) 0.12%,
      rgba(var(--background-primary-dark-rgb), 0.9) 55.52%,
      rgba(var(--background-primary-dark-rgb), 0.5) 100%
    ),
    url('/images/backround-about-us.png');
  background-size: cover;
}
/* stylelint-enable */

.about-us__title {
  margin-bottom: toRem(70);
  text-transform: uppercase;
  color: var(--background-primary);
  margin-top: toRem(30);

  @include subtitle-underline;
}

.about-us__subtitle {
  font-size: toRem(32);
  line-height: toRem(39);
  margin-bottom: toRem(15);
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: toRem(3);
  color: var(--text-primary-invert-main);

  @include respond-to(medium) {
    font-size: toRem(20);
  }
}

.about-us__cubes {
  position: absolute;
  max-width: min-content;
  width: 40%;

  @include respond-to(medium) {
    display: none;
  }

  &--left {
    left: 0;
    transform: translate(0, toRem(-300));
  }

  &--right {
    right: 0;
    transform: translate(0, toRem(-400));
  }

  &--bottom {
    right: 0;
    bottom: 0;
  }
}

.about-us__background {
  @include background-image;
}
</style>
