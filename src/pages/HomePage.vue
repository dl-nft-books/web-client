<script setup lang="ts">
import { Icon } from '@/common'
import { Animation } from '@/common'
import blockchainAnimation from '@/assets/animations/blockchain-animation.json'

const FOUNDER_IMAGE = '/images/pavlo-kravchenko.png'
</script>

<template>
  <div class="home-page">
    <div class="home-page__head">
      <div class="home-page__head-wrapper">
        <h1 class="home-page__title">
          {{ $t('home-page.title') }}
        </h1>
        <h3 class="home-page__subtitle">
          {{ $t('home-page.subtitle') }}
          <span class="home-page__subtitle home-page__subtitle--highlighted">
            {{ $t('home-page.subtitle-highlighted') }}
          </span>
        </h3>
        <h4 class="home-page__section-title home-page__section-title--small">
          {{ $t('home-page.small-subtitle') }}
        </h4>
        <div class="home-page__book-description-wrapper">
          <icon class="home-page__book-description-icon" :name="$icons.book" />
          <span class="home-page__book-description">
            {{ $t('home-page.book-description') }}
          </span>
        </div>
      </div>
    </div>
    <div class="home-page__about-us">
      <div class="home-page__about-us-animation-wrapper">
        <animation
          class="home-page__about-us-animation"
          :animation-data="blockchainAnimation"
          :loop="true"
          :speed="0.75"
        />
      </div>
      <div class="home-page__about-us-content">
        <h4 class="home-page__section-title">
          {{ $t('home-page.about-us-title') }}
        </h4>
        <p class="home-page__about-us-text">
          {{ $t('home-page.about-us-text-1') }}
        </p>
        <p class="home-page__about-us-text">
          {{ $t('home-page.about-us-text-2') }}
        </p>
      </div>
    </div>
    <div class="home-page__founder">
      <div class="home-page__founder-content-wrapper">
        <div class="home-page__founder-content">
          <h4 class="home-page__founder-content-title">
            {{ $t('home-page.founder-title') }}
          </h4>
          <h5 class="home-page__founder-content-subtitle">
            {{ $t('home-page.founder-subtitle') }}
          </h5>
          <p class="home-page__founder-content-description">
            {{ $t('home-page.founder-description') }}
          </p>
        </div>
        <div class="home-page__founder-image-wrapper">
          <img
            class="home-page__founder-image"
            :src="FOUNDER_IMAGE"
            :alt="$t('home-page.founder-image')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding: 0;
  max-width: 100%;
}

.home-page__head {
  background: url('/icons/home-page-bg.svg') no-repeat right bottom / contain;

  @include respond-to(medium) {
    background-size: toRem(450);
  }

  @include respond-to(small) {
    background-size: toRem(300);
  }
}

.home-page__head-wrapper {
  padding: toRem(115) var(--app-padding-right) toRem(100)
    var(--app-padding-left); /* stylelint-disable-line max-line-length */
}

.home-page__title {
  margin-bottom: toRem(70);
  font-weight: 1000;
  font-size: toRem(58);
  letter-spacing: toRem(3);
  text-transform: uppercase;
  color: var(--background-primary);
  text-shadow: toRem(-1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(-1) 0 var(--text-primary-main),
    toRem(-1) toRem(-1) 0 var(--text-primary-main);

  @include respond-to(medium) {
    font-size: toRem(40);
  }
}

.home-page__subtitle {
  font-weight: 1000;
  font-size: toRem(48);
  margin-bottom: toRem(15);

  &--highlighted {
    color: var(--primary-main);
  }

  @include respond-to(medium) {
    font-size: toRem(32);
  }
}

.home-page__small-title {
  font-size: toRem(28);
  font-weight: 400;
  white-space: pre-line;
  line-height: 120%;
  margin-bottom: toRem(10);

  &:after {
    display: block;
    content: '';
    width: clamp(#{toRem(155)}, 20%, #{toRem(215)});
    height: toRem(2);
    margin-top: toRem(10);
    background: var(--primary-main);
  }

  @include respond-to(medium) {
    font-size: toRem(20);
  }
}

.home-page__book-description-wrapper {
  display: flex;
  align-items: center;
  gap: toRem(20);
  margin: toRem(60) 0 toRem(200);
}

.home-page__book-description {
  font-size: toRem(24);
  line-height: 120%;
  font-weight: 400;
  white-space: pre-line;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.home-page__book-description-icon {
  max-width: toRem(50);
  max-height: toRem(45);

  @include respond-to(medium) {
    max-width: toRem(35);
    max-height: toRem(30);
  }
}

.home-page__about-us {
  display: grid;
  padding: 0 toRem(100) 0 toRem(20);
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  grid-column-gap: toRem(90);

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
  }
}

.home-page__about-us-content {
  padding: toRem(100) 0;

  @include respond-to(medium) {
    padding: toRem(50) 0 0;
  }
}

.home-page__section-title {
  font-size: toRem(40);

  &:after {
    display: block;
    content: '';
    width: clamp(#{toRem(120)}, 40%, #{toRem(145)});
    height: toRem(2);
    margin-top: toRem(10);
    background: var(--primary-main);
  }

  &--small {
    font-size: toRem(28);
    font-weight: 400;
    white-space: pre-line;
    line-height: 120%;
    margin-bottom: toRem(10);

    &:after {
      width: clamp(#{toRem(155)}, 20%, #{toRem(215)});
    }
  }

  @include respond-to(medium) {
    font-size: toRem(30);
    text-align: center;

    &:after {
      margin: toRem(10) auto 0;
    }

    &--small {
      font-size: toRem(20);
      text-align: left;

      &:after {
        margin: toRem(10) 0 0;
      }
    }
  }
}

.home-page__about-us-text {
  font-size: toRem(18);
  margin-top: toRem(50);

  &:nth-child(2n) {
    margin-top: toRem(25);
  }

  @include respond-to(medium) {
    font-size: toRem(14);
    text-align: center;
  }
}

.home-page__founder {
  background-color: var(--background-quinary);
  background-image: url('/images/background-founder-cubes.png');
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: toRem(600);
}

.home-page__founder-content-wrapper {
  display: flex;
  column-gap: toRem(100);
  padding: toRem(45) var(--app-padding-right) toRem(80) var(--app-padding-left);

  @include respond-to(medium) {
    flex-direction: column;
  }
}

.home-page__founder-content-title {
  font-weight: 700;
  font-size: toRem(40);
  text-transform: uppercase;
  color: var(--text-primary-invert-main);
  margin-top: toRem(50);

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(30);
  }
}

.home-page__founder-content-subtitle {
  color: var(--text-primary-invert-main);
  font-size: toRem(20);
  text-transform: uppercase;
  margin-top: toRem(10);

  &:after {
    display: block;
    content: '';
    width: clamp(#{toRem(150)}, 40%, #{toRem(228)});
    height: toRem(2);
    margin-top: toRem(10);
    background: var(--primary-main);
  }

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(16);

    &:after {
      margin: toRem(10) auto 0;
    }
  }
}

.home-page__founder-content-description {
  color: var(--text-primary-invert-main);
  font-size: toRem(18);
  margin-top: toRem(55);

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(14);
  }
}

.home-page__founder-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-page__founder-image {
  max-width: toRem(458);

  @include respond-to(medium) {
    margin-top: toRem(50);
    max-width: toRem(250);
  }
}

.home-page__about-us-animation-wrapper {
  max-width: 100%;

  @include respond-to(medium) {
    width: 60%;
    margin: 0 auto;
    order: 1;
  }
}
</style>
