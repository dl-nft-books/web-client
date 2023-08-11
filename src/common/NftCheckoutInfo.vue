<template>
  <div class="nft-checkout-info">
    <section class="nft-checkout-info__header">
      <p>{{ $t('nft-checkout-info.price-conversion-lbl') }}</p>
      <p>{{ priceConversion }}</p>
    </section>
    <hr class="nft-checkout-info__divider" />
    <section class="nft-checkout-info__details">
      <div class="nft-checkout-info__details-wrapper">
        <p>{{ $t('nft-checkout-info.impact-lbl') }}</p>
        <p>
          {{ $t('nft-checkout-info.impact-value', { impact: info.impact }) }}
        </p>
      </div>
      <div v-if="info.gasPrice" class="nft-checkout-info__details-wrapper">
        <p>{{ $t('nft-checkout-info.network-fee-lbl') }}</p>
        <p>{{ info.gasPrice }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { BN } from '@distributedlab/tools'

export type EstimatedPriceInfo = {
  gasPrice: string
  impact: string
  initialPrice: {
    value: string
    symbol: string
  }
  price: {
    value: string
    decimals: number
    symbol: string
  }
  balance: string
}
const props = defineProps<{ info: EstimatedPriceInfo }>()

const DECIMALS = 5

const priceConversion = [
  BN.fromRaw(props.info.initialPrice.value, DECIMALS).toString(),
  props.info.initialPrice.symbol,
  '=',
  BN.fromBigInt(props.info.price.value).round(DECIMALS).toString(),
  props.info.price.symbol,
].join(' ')
</script>

<style lang="scss" scoped>
.nft-checkout-info {
  display: flex;
  flex-direction: column;
  border-radius: toRem(8);
  border: toRem(1) solid var(--border-primary-main);
  padding: toRem(12) toRem(8);
}

.nft-checkout-info__divider {
  height: toRem(1);
  width: 100%;
  align-self: center;
  background: var(--border-primary-main);
  border: none;
}

.nft-checkout-info__header {
  display: flex;
  justify-content: space-between;
  gap: toRem(10);

  & > * {
    font-size: toRem(14);
    font-weight: 700;
  }
}

.nft-checkout-info__details-wrapper {
  display: flex;
  justify-content: space-between;

  & > * {
    font-size: toRem(12);
  }
}
</style>
