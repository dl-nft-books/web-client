<template>
  <header class="bookshelf-header">
    <bookshelf-cubes />
    <h1 class="bookshelf-header__title">
      {{ $t('home-page.title') }}
    </h1>
    <h4 class="bookshelf-header__subtitle">
      {{ $t('home-page.small-subtitle') }}
    </h4>
    <div class="bookshelf-header__description">
      <icon class="bookshelf-header__icon" :name="$icons.bookWithFeather" />
      <div class="bookshelf-header__book-desctiption">
        <p>{{ $t('home-page.book-description.title') }}</p>
        <p>{{ $t('home-page.book-description.subtitle') }}</p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { BookshelfCubes } from '@/pages/Bookshelf'
import { Icon } from '@/common'
</script>

<style lang="scss" scoped>
.bookshelf-header {
  padding: toRem(80) 0;

  @include respond-to(small) {
    padding-top: toRem(20);
  }
}

.bookshelf-header__title {
  margin-bottom: toRem(5);
  font-weight: 1000;
  font-size: toRem(58);
  letter-spacing: toRem(3);
  text-transform: uppercase;
  color: var(--background-primary);
  text-shadow: toRem(-1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(-1) 0 var(--text-primary-main),
    toRem(-1) toRem(-1) 0 var(--text-primary-main);
  position: relative;
  z-index: var(--page-index);

  @include respond-to(medium) {
    font-size: toRem(40);
  }
}

.bookshelf-header__subtitle {
  font-size: toRem(24);
  font-weight: 600;
  line-height: 120%;
  color: var(--primary-dark);
  position: relative;
  z-index: var(--page-index);
  text-shadow: toRem(-1) toRem(1) 0 var(--text-primary-invert-main),
    toRem(1) toRem(1) 0 var(--text-primary-invert-main),
    toRem(1) toRem(-1) 0 var(--text-primary-invert-main),
    toRem(-1) toRem(-1) 0 var(--text-primary-invert-main);

  @include respond-to(medium) {
    font-size: toRem(20);
    text-align: left;
  }
}

.bookshelf-header__description {
  display: flex;
  align-items: center;
  gap: toRem(20);
  margin: toRem(40) 0 toRem(80);
  position: relative;
  z-index: var(--page-index);
  width: fit-content;

  @include respond-to(xmedium) {
    margin-left: toRem(60);
  }

  @include respond-to(small) {
    margin-left: toRem(20);
  }
}

.bookshelf-header__book-desctiption {
  display: flex;
  flex-direction: column;

  & > * {
    text-shadow: toRem(-1) toRem(1) 0 var(--text-primary-invert-main),
      toRem(1) toRem(1) 0 var(--text-primary-invert-main),
      toRem(1) toRem(-1) 0 var(--text-primary-invert-main),
      toRem(-1) toRem(-1) 0 var(--text-primary-invert-main);
  }

  & > *:first-child {
    font-size: toRem(22);
    line-height: 120%;
    font-weight: 400;
  }

  & > *:nth-child(2) {
    font-size: toRem(22);
    line-height: 120%;
    font-weight: 500;
    font-style: italic;
  }

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.bookshelf-header__icon {
  max-width: toRem(50);
  max-height: toRem(60);

  @include respond-to(medium) {
    max-width: toRem(35);
    max-height: toRem(30);
  }
}
</style>
