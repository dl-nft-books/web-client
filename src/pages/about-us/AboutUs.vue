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

    <img
      class="about-us__cubes about-us__cubes--right"
      :src="CUBES_IMAGES.RIGHT"
    />

    <about-us-quote-card
      class="about-us__quote-card"
      :title="$t('about-us-page.founder-title')"
      :subtitle="$t('about-us-page.founder-subtitle')"
      :image="FOUNDERS_IMAGES.KRAVCHENKO"
      :quotes-list="KravchenkoQuotes"
    />

    <img
      class="about-us__cubes about-us__cubes--left"
      :src="CUBES_IMAGES.LEFT"
    />

    <about-us-quote-card
      class="about-us__quote-card"
      scheme="dark"
      modification="reverse"
      :title="$t('about-us-page.founder-title-2')"
      :subtitle="$t('about-us-page.founder-subtitle-2')"
      :image="FOUNDERS_IMAGES.KURBATOV"
      :quotes-list="KurbatovQuotes"
    />

    <img
      class="about-us__cubes about-us__cubes--bottom"
      :src="CUBES_IMAGES.BOTTOM"
    />
  </div>
</template>

<script setup lang="ts">
import { AboutUsDecription, AboutUsQuoteCard } from '@/pages/about-us'
import { useContext } from '@/composables'

const { $t } = useContext()

const CUBES_IMAGES = {
  LEFT: '/images/about-us-left.png',
  RIGHT: '/images/about-us-right.png',
  BOTTOM: '/images/about-us-right-back.png',
}

const FOUNDERS_IMAGES = {
  KURBATOV: '/images/olexandr-kurbatov.png',
  KRAVCHENKO: '/images/pavlo-kravchenko.png',
}

const KravchenkoQuotes = [$t('about-us-page.founder-description')]

const KurbatovQuotes = [
  $t('about-us-page.founder-description-2-abstract-1'),
  $t('about-us-page.founder-description-2-abstract-2'),
  $t('about-us-page.founder-description-2-abstract-3'),
  $t('about-us-page.founder-description-2-abstract-4'),
]
</script>

<style lang="scss" scoped>
.about-us {
  max-width: 100%;
  padding: 0;
  background-color: var(--background-quinary);
  position: relative;
}

.about-us__quote-card {
  padding-top: toRem(140);
  padding-bottom: toRem(100);
}

/* stylelint-disable */
.about-us__head {
  text-align: center;
  padding: toRem(115) var(--app-padding-right) toRem(100)
    var(--app-padding-left);
  background-image: linear-gradient(
      360deg,
      var(--background-quinary) 0.12%,
      rgba(var(--background-quinary-rgb), 0.9) 55.52%,
      rgba(var(--background-quinary-rgb), 0.5) 100%
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
</style>
