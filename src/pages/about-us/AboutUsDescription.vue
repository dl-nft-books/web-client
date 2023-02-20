<template>
  <div class="about-us-description">
    <div class="about-us-description__animation">
      <animation
        :animation-data="blockchainAnimation"
        :loop="true"
        :speed="0.75"
      />
    </div>
    <div class="about-us-description__content">
      <p
        v-for="(phrase, index) in aboutUsInfo"
        :key="index"
        class="about-us-description__text"
      >
        {{ phrase }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Animation } from '@/common'
import { useContext } from '@/composables'

import blockchainAnimation from '@/assets/animations/blockchain-animation.json'

const { $t } = useContext()

const aboutUsInfo = [
  $t('about-us-page.description-abstract-1'),
  $t('about-us-page.description-abstract-2'),
  $t('about-us-page.description-abstract-3'),
  $t('about-us-page.description-abstract-4'),
]
</script>

<style lang="scss" scoped>
.about-us-description {
  display: grid;
  padding: 0 toRem(100) 0 toRem(20);
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  grid-column-gap: toRem(90);
  align-items: center;
  margin-top: toRem(150);
  margin-bottom: toRem(40);

  @include respond-to(medium) {
    display: flex;
    flex-direction: column-reverse;
    margin-top: 0;
    padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
  }
}

.about-us-description__animation {
  max-width: 80%;
  display: block;
  margin-left: auto;
  margin-right: auto;

  @include respond-to(medium) {
    width: 60%;
    margin: 0 auto;
    order: 1;
  }
}

.about-us-description__content {
  padding-right: toRem(10);
  padding-bottom: toRem(100);

  @include respond-to(medium) {
    padding: toRem(50) 0 0;
  }
}

.about-us-description__text {
  font-size: toRem(18);
  line-height: 160%;
  color: var(--text-primary-invert-main);

  &:nth-child(2n) {
    margin-top: toRem(25);
  }

  @include respond-to(medium) {
    font-size: toRem(16);
    text-align: center;
  }
}
</style>
