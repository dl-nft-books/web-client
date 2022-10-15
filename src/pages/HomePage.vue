<script setup lang="ts">
import { Icon } from '@/common'
</script>

<template>
  <div class="home-page">
    <div class="home-page__head">
      <h2 class="home-page__title">
        {{ $t('home-page.title') }}
      </h2>
      <h3 class="home-page__subtitle">
        {{ $t('home-page.subtitle') }}
        <span class="home-page__subtitle home-page__subtitle--highlighted">
          {{ $t('home-page.subtitle-highlighted') }}
        </span>
      </h3>
      <h4 class="home-page__small-title">
        {{ $t('home-page.small-subtitle') }}
      </h4>
      <hr class="home-page__line home-page__line--page-title" />
      <div class="home-page__book-description-wrapper">
        <icon class="home-page__book-description-icon" :name="$icons.book" />
        <span class="home-page__book-description">
          {{ $t('home-page.book-description') }}
        </span>
      </div>
    </div>
    <div class="home-page__most-popular"></div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding-top: toRem(100);
}

.home-page__title {
  margin-bottom: toRem(70);
  font-weight: 1000;
  font-size: toRem(58);
  letter-spacing: toRem(3);
  text-transform: uppercase;
  color: var(--app-background-primary);
  text-shadow: toRem(-1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(-1) 0 var(--text-primary-main),
    toRem(-1) toRem(-1) 0 var(--text-primary-main);
}

.home-page__subtitle {
  font-weight: 1000;
  font-size: toRem(48);
  margin-bottom: toRem(15);

  &--highlighted {
    color: var(--primary-main);
  }
}

.home-page__small-title {
  font-size: toRem(28);
  font-weight: 400;
  white-space: pre-line;
  line-height: 120%;
  margin-bottom: toRem(10);
}

.home-page__line {
  height: toRem(1);
  border: none;
  background: var(--primary-main);
  margin: 0;

  &--page-title {
    width: toRem(215);
  }
}

.home-page__book-description-wrapper {
  display: flex;
  align-items: center;
  gap: toRem(20);
  margin-top: toRem(60);
}

.home-page__book-description {
  font-size: toRem(24);
  line-height: 120%;
  font-weight: 400;
  white-space: pre-line;
}

.home-page__book-description-icon {
  max-width: toRem(50);
  max-height: toRem(45);
}
</style>
