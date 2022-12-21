<template>
  <div class="book-preview">
    <div class="book-preview__img-wrapper">
      <img class="book-preview__img" :src="book.bannerUrl" :alt="book.title" />
    </div>
    <div class="book-preview__details">
      <h4 class="book-preview__title">
        {{ book.title }}
      </h4>
      <span class="book-preview__price">
        {{ formatFiatAssetFromWei(book.price, 'USD') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookRecord } from '@/records'
import { formatFiatAssetFromWei } from '@/helpers'

defineProps<{
  book: BookRecord
}>()
</script>

<style lang="scss" scoped>
.book-preview {
  display: flex;
  width: 100%;
  gap: toRem(20);
  padding-bottom: toRem(24);
  margin-bottom: toRem(10);
  border-bottom: toRem(1) solid var(--border-primary-main);
}

.book-preview__img-wrapper {
  filter: drop-shadow(0 toRem(4) toRem(8) rgba(150, 150, 157, 0.25));
  max-width: toRem(120);
  max-height: toRem(120);
}

.book-preview__img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
  filter: var(--cover-image-shadow-small);
}

.book-preview__details {
  display: flex;
  flex-direction: column;
}

.book-preview__title {
  text-transform: uppercase;
  font-size: toRem(18);
  line-height: 1.2;
  font-weight: 600;
  max-width: toRem(300);

  @include text-ellipsis;

  @include respond-to(medium) {
    max-width: toRem(200);
  }
}

.book-preview__price {
  text-transform: uppercase;
  margin-top: auto;
  font-size: toRem(22);
  line-height: 1.2;
  font-weight: 900;
  color: var(--primary-main);
}
</style>
