<template>
  <header class="bookshelf-header">
    <h1 class="bookshelf-header__title">
      {{ $t('bookshelf-header.title') }}
    </h1>
    <div class="bookshelf-header__description">
      <icon class="bookshelf-header__icon" :name="$icons.bookWithFeather" />
      <div class="bookshelf-header__book-desctiption">
        <p
          :class="[
            'bookshelf-header__text',
            'bookshelf-header__text--shadow-color-invert',
          ]"
        >
          {{ $t('bookshelf-header.book-description-title') }}
        </p>
        <p
          :class="[
            'bookshelf-header__text',
            'bookshelf-header__text--italic',
            'bookshelf-header__text--bold',
            'bookshelf-header__text--shadow-color-invert',
          ]"
        >
          {{ $t('bookshelf-header.book-description-subtitle') }}
        </p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
</script>

<style lang="scss" scoped>
.bookshelf-header {
  padding: toRem(80) 0;
  position: relative;
  z-index: var(--page-index);

  @include respond-to(small) {
    padding-top: toRem(20);
  }
}

.bookshelf-header__title {
  margin-bottom: toRem(5);

  @include text-shadow;

  @include text-color-invert;
}

.bookshelf-header__description {
  display: flex;
  align-items: center;
  gap: toRem(20);
  margin: toRem(40) 0 toRem(80);
  width: fit-content;

  @include respond-to(xmedium) {
    margin-left: toRem(60);
  }

  @include respond-to(small) {
    margin-left: toRem(20);
  }
}

.bookshelf-header__book-desctiption {
  @include flex-container;
}

.bookshelf-header__text {
  &--italic {
    font-style: italic;
  }

  @include p-body-2;

  @include text-shadow;
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
