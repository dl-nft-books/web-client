<!-- TODO: refactor component -->
<script lang="ts" setup>
import { Book } from '@/types'
import { Icon } from '@/common'
import { formatFiatAsset } from '@/helpers'
import { formatMDY } from '@/helpers'

defineProps<{ book: Book }>()
</script>

<template>
  <div class="nft-details">
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.purchase-date-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ formatMDY(book.purchaseDate) }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.price-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ formatFiatAsset(book.price.amount, 'USD') }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.token-amount-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ book.token?.amount }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.your-token-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ book.token?.assetCode }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.signature-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ book.signature }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.document-lbl') }}
      </p>
      <p class="nft-details__row-value nft-details__row-value--document">
        {{ book.document?.name }}
        <icon class="nft-details__row-icon" :name="$icons.download" />
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nft-details {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.nft-details__row {
  display: grid;
  grid-template-columns: toRem(220) 1fr;
  grid-gap: toRem(20);

  @include respond-to(small) {
    grid-template-columns: 1fr;
    grid-gap: toRem(10);
  }
}

.nft-details__row-label {
  font-size: toRem(20);
  line-height: 1.2;
  color: var(--text-secondary-main);

  @include respond-to(small) {
    font-size: toRem(16);
  }
}

.nft-details__row-value {
  font-size: toRem(24);
  line-height: 1.2;

  @include respond-to(small) {
    font-size: toRem(20);
  }
}

.nft-details__row-value--document {
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: max-content;
}

.nft-details__row-icon {
  display: block;
  margin-left: toRem(10);
  width: toRem(24);
  height: toRem(24);
  color: var(--primary-main);
}
</style>
