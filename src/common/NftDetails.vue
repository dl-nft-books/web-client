<!-- TODO: refactor component -->
<script lang="ts" setup>
import { Icon } from '@/common'
import { formatFiatAssetFromWei, formatAmount } from '@/helpers'
import { formatMDY } from '@/helpers'
import { GeneratedNFtRecord } from '@/records'

defineProps<{ nftToken: GeneratedNFtRecord }>()
</script>

<template>
  <div class="nft-details">
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.purchase-date-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ formatMDY(nftToken.payment.purchaseTimestamp) }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.price-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ formatFiatAssetFromWei(nftToken.payment.price, 'USD') }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.token-amount-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{
          formatAmount(nftToken.payment.amount, nftToken.payment.erc20Decimals)
        }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.your-token-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ nftToken.payment.erc20Symbol }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.signature-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ nftToken.signature }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.document-lbl') }}
      </p>
      <a
        target="_blank"
        rel="noopener"
        :href="nftToken.payment.bookUrl"
        class="nft-details__row-value nft-details__row-value--document"
      >
        <span class="nft-details__row-value--document-text">
          {{ nftToken.payment.bookUrl }}
        </span>
        <icon class="nft-details__row-icon" :name="$icons.download" />
      </a>
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
  max-width: 100%;
  overflow: hidden;
  font-weight: inherit;
}

.nft-details__row-value--document-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: toRem(24);
}

.nft-details__row-icon {
  display: inline-block;
  width: toRem(24);
  height: toRem(24);
  min-width: toRem(24);
  color: var(--primary-main);
  margin-left: toRem(10);
}
</style>
