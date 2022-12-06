<template>
  <div class="about-us">
    <div class="about-us__head">
      <div class="about-us__head-gradient">
        <div class="about-us__head-wrapper">
          <h1 class="about-us__title">
            {{ $t('about-us-page.title') }}
          </h1>
          <h3 class="about-us__subtitle">
            {{ $t('about-us-page.subtitle') }}
          </h3>
        </div>
      </div>
    </div>
    <div class="about-us__description">
      <div class="about-us__description-animation-wrapper">
        <animation
          class="about-us__description-animation"
          :animation-data="blockchainAnimation"
          :loop="true"
          :speed="0.75"
        />
      </div>
      <div class="about-us__description-content">
        <p class="about-us__description-text">
          {{ $t('about-us-page.about-us-text-1') }}
        </p>
        <p class="about-us__description-text">
          {{ $t('about-us-page.about-us-text-2') }}
        </p>
      </div>
      <img
        class="about-us__cubes about-us__cubes--right"
        :src="CUBES_IMAGES.RIGHT"
      />
    </div>

    <div class="about-us__founder">
      <div class="about-us__founder-background">
        <div class="about-us__founder-image-wrapper">
          <img
            class="about-us__founder-image"
            :src="FOUNDERS_IMAGES.KRAVCHENKO"
            alt="Founder image"
          />
          <h4 class="about-us__founder-content-title">
            {{ $t('about-us-page.founder-title') }}
          </h4>
          <h5 class="about-us__founder-content-subtitle">
            {{ $t('about-us-page.founder-subtitle') }}
          </h5>
        </div>
        <div class="about-us__founder-content-wrapper">
          <icon class="about-us__founder-quote" :name="$icons.leftQuote" />
          <p class="about-us__founder-content-description">
            {{ $t('about-us-page.founder-description') }}
          </p>
        </div>
        <img
          class="about-us__cubes about-us__cubes--left"
          :src="CUBES_IMAGES.LEFT"
        />
      </div>
    </div>
    <div class="about-us__founder about-us__founder--black">
      <div
        class="about-us__founder-background about-us__founder-background--black"
      >
        <div
          :class="[
            'about-us__founder-content-wrapper',
            'about-us__founder-content-wrapper--black',
          ]"
        >
          <icon class="about-us__founder-quote" :name="$icons.leftQuote" />
          <p
            :class="[
              'about-us__founder-content-description',
              'about-us__founder-content-description--black',
            ]"
          >
            {{ $t('about-us-page.founder-description-2-abstract-1') }}
          </p>
          <p
            :class="[
              'about-us__founder-content-description',
              'about-us__founder-content-description--black',
            ]"
          >
            {{ $t('about-us.founder-description-2-abstract-2') }}
          </p>
          <p
            :class="[
              'about-us__founder-content-description',
              'about-us__founder-content-description--black',
            ]"
          >
            {{ $t('about-us-page.founder-description-2-abstract-3') }}
          </p>
          <p
            :class="[
              'about-us__founder-content-description',
              'about-us__founder-content-description--black',
            ]"
          >
            {{ $t('about-us-page.founder-description-2-abstract-4') }}
          </p>
        </div>
        <div
          :class="[
            'about-us__founder-image-wrapper',
            'about-us__founder-image-wrapper--black',
          ]"
        >
          <img
            class="about-us__founder-image"
            :src="FOUNDERS_IMAGES.KURBATOV"
            alt="Founder image"
          />
          <h4
            :class="[
              'about-us__founder-content-title',
              'about-us__founder-content-title--black',
            ]"
          >
            {{ $t('about-us-page.founder-title-2') }}
          </h4>
          <h5
            :class="[
              'about-us__founder-content-subtitle',
              'about-us__founder-content-subtitle--black',
            ]"
          >
            {{ $t('about-us-page.founder-subtitle-2') }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon, Animation } from '@/common'
import blockchainAnimation from '@/assets/animations/blockchain-animation.json'
const CUBES_IMAGES = {
  LEFT: '/images/about-us-left.png',
  RIGHT: '/images/about-us-right.png',
}

const FOUNDERS_IMAGES = {
  KURBATOV: '/images/olexandr-kurbatov.png',
  KRAVCHENKO: '/images/pavlo-kravchenko.png',
}
</script>

<style lang="scss" scoped>
.about-us {
  max-width: 100%;
  padding: 0;
  background-color: var(--background-quinary);
}

.about-us__head {
  background-image: url('/images/backround-about-us.png');
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;

  @include respond-to(medium) {
    background-size: toRem(550);
  }

  @include respond-to(small) {
    background-size: 100%;
  }
}

.about-us__head-gradient {
  width: 100%;
  background: linear-gradient(
    360deg,
    var(--background-quinary) 0.12%,
    rgba(var(--background-quinary-rgb), 0.9) 55.52%,
    rgba(var(--background-quinary-rgb), 0.5) 100%
  );
}

.about-us__head-wrapper {
  padding: toRem(115) var(--app-padding-right) toRem(100)
    var(--app-padding-left); /* stylelint-disable-line max-line-length */
}

.about-us__title {
  margin-bottom: toRem(70);
  font-weight: 700;
  font-size: toRem(40);
  text-transform: uppercase;
  color: var(--background-primary);
  margin-top: toRem(102);

  &:after {
    display: block;
    content: '';
    height: toRem(2);
    margin-top: toRem(10);
    background: var(--primary-main);
    margin-left: auto;
    margin-right: auto;
    width: clamp(#{toRem(155)}, 20%, #{toRem(215)});
  }

  @include respond-to(medium) {
    font-size: toRem(40);
  }
}

.about-us__subtitle {
  font-size: toRem(32);
  margin-bottom: toRem(15);
  text-transform: uppercase;
  color: var(--background-primary);
  font-weight: 400;
  letter-spacing: toRem(3);

  @include respond-to(medium) {
    font-size: toRem(32);
  }
}

.about-us__description {
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

.about-us__description-content {
  margin-right: 5vw;

  @include respond-to(medium) {
    padding: toRem(50) 0 0;
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
    transform: translate(0, toRem(150));
  }

  &--right {
    right: 0;
    transform: translate(0, toRem(250));
  }
}

.about-us__description-text {
  font-size: toRem(18);
  color: var(--background-primary);

  &:nth-child(2n) {
    margin-top: toRem(25);
  }

  @include respond-to(medium) {
    font-size: toRem(14);
    text-align: center;
  }
}

.about-us__founder {
  background-color: var(--background-primary);
  padding-top: toRem(140);
  padding-bottom: toRem(100);

  &--black {
    background: none;
    background-image: url('/images/about-us-right-back.png');
    background-repeat: no-repeat;
    background-position: right bottom;
  }
}

.about-us__founder-content-wrapper {
  display: flex;
  flex-direction: column;
  transform: translate(0, toRem(-140));

  @include respond-to(medium) {
    transform: translate(0, 0);
  }

  &--black {
    transform: translate(0, toRem(-75));
    align-items: flex-end;

    @include respond-to(medium) {
      transform: translate(0, 0);
    }
  }
}

.about-us__founder-content-title {
  display: block;
  font-size: toRem(24);
  text-transform: uppercase;
  color: var(--text-primary-main);
  margin-top: toRem(25);
  align-self: flex-end;

  @include respond-to(medium) {
    align-self: center;
  }

  &--black {
    color: var(--text-primary-invert-light);
    align-self: flex-start;

    @include respond-to(medium) {
      align-self: center;
    }
  }
}

.about-us__founder-content-subtitle {
  color: var(--text-primary-main);
  font-size: toRem(14);
  text-transform: uppercase;
  margin-top: toRem(10);
  align-self: flex-end;

  @include respond-to(medium) {
    align-self: center;
  }

  &--black {
    color: var(--text-primary-invert-light);
    align-self: flex-start;

    @include respond-to(medium) {
      align-self: center;
    }
  }
}

.about-us__founder-quote {
  width: toRem(57);

  @include respond-to(medium) {
    display: none;
  }
}

.about-us__founder-content-description {
  color: var(--text-primary-main);
  font-size: toRem(18);
  align-self: flex-start;

  @include respond-to(medium) {
    padding: 2vw;
    font-size: toRem(14);
  }

  &--black {
    color: var(--text-primary-invert-light);
    padding-top: toRem(15);
    padding-left: toRem(30);
  }
}

.about-us__founder-background {
  background-color: var(--background-tertiary);
  border-radius: toRem(11);
  display: flex;
  width: 60%;
  margin-left: auto;
  margin-right: auto;

  @include respond-to(medium) {
    width: 80%;
    flex-direction: column;
  }

  &--black {
    background-color: var(--background-secondary);

    @include respond-to(medium) {
      padding-bottom: 3vh;
    }
  }
}

.about-us__founder-image-wrapper {
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  width: max-content;
  transform: translate(toRem(-65), toRem(-40));

  @include respond-to(medium) {
    transform: translate(0, toRem(-20));
    margin-left: auto;
    margin-right: auto;
  }

  &--black {
    transform: translate(toRem(60), toRem(-60));

    @include respond-to(medium) {
      transform: translate(0, 0);
    }
  }
}

.about-us__founder-image {
  max-width: toRem(280);
  align-self: flex-end;

  @include respond-to(medium) {
    align-self: center;
    max-width: toRem(200);
  }
}

.about-us__description-animation-wrapper {
  max-width: 60%;
  display: block;
  margin-left: auto;
  margin-right: auto;

  @include respond-to(medium) {
    width: 60%;
    margin: 0 auto;
    order: 1;
  }
}
</style>
