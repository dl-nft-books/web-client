<template>
  <div class="book-preview">
    <div class="book-preview__img-wrapper">
      <img
        class="book-preview__img"
        :src="book.banner.attributes.url"
        :alt="book.tokenName"
      />
    </div>
    <div class="book-preview__details">
      <h4 class="book-preview__title">
        {{ book.tokenName }}
      </h4>
      <div class="book-preview__price-wrapper">
        <span
          v-if="modification === 'floor-price'"
          class="book-preview__price-label"
        >
          {{ $t('book-preview.label') }}
        </span>
        <span class="book-preview__price">
          {{ price }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatFiatAssetFromWei } from '@/helpers'
import { FullBookInfo } from '@/types'
import { useWeb3ProvidersStore } from '@/store'

type MODIFICATIONS = 'floor-price' | 'default'

const props = withDefaults(
  defineProps<{
    book: FullBookInfo
    modification?: MODIFICATIONS
  }>(),
  {
    modification: 'default',
  },
)

const web3Store = useWeb3ProvidersStore()

const price = computed(() =>
  formatFiatAssetFromWei(
    props.modification === 'floor-price'
      ? props.book.minNFTFloorPrice
      : props.book.pricePerOneToken,
    web3Store.chainCurrency,
  ),
)
</script>

<style lang="scss" scoped>
.book-preview {
  display: grid;
  grid-template-columns: 30% 1fr;
  gap: toRem(20);
  padding-bottom: toRem(24);
  margin-bottom: toRem(10);
  border-bottom: toRem(1) solid var(--border-primary-main);
}

.book-preview__price-wrapper {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  gap: toRem(10);
  padding-top: toRem(40);
}

.book-preview__price-label {
  font-size: toRem(14);
  color: var(--text-primary-light);
}

.book-preview__img-wrapper {
  filter: drop-shadow(0 toRem(4) toRem(8) rgba(var(--shadow-color), 0.25));
  max-width: toRem(120);
  max-height: toRem(120);
  min-width: toRem(100);
  min-height: toRem(100);
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
  word-break: break-all;

  @include line-clamp(3);
}

.book-preview__price {
  text-transform: uppercase;
  font-size: toRem(22);
  line-height: 1.2;
  font-weight: 900;
  color: var(--primary-main);

  @include text-ellipsis;
}
</style>
