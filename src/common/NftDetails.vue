<template>
  <div class="nft-details">
    <div v-for="(item, index) in details" :key="index" class="nft-details__row">
      <p class="nft-details__row-label nft-details__row-label--size-x-large">
        {{ item.label }}
      </p>
      <a
        v-if="item.isUrl"
        target="_blank"
        rel="noopener"
        :href="item.value"
        class="nft-details__row-value nft-details__row-value--document"
      >
        <span
          :class="[
            'nft-details__row-value',
            'nft-details__row-value--size-large',
            'nft-details__row-value--shortened',
          ]"
        >
          {{ item.value }}
        </span>
        <icon class="nft-details__row-icon" :name="$icons.download" />
      </a>
      <p
        v-else
        class="nft-details__row-value nft-details__row-value--size-large"
      >
        {{ item.value }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import {
  formatFiatAssetFromWei,
  formatAssetFromWei,
  formatMDY,
} from '@/helpers'

import { CURRENCY } from '@/enums'
import {
  BookPaymentNftExchangeRecord,
  BookPaymentRecord,
  GeneratedNFtRecord,
} from '@/records'
import { useContext } from '@/composables'
import { NftDetails } from '@/types'

const props = defineProps<{ nftToken: GeneratedNFtRecord }>()

const { $t } = useContext()

const getDetails = () => {
  if (props.nftToken.payment instanceof BookPaymentRecord) {
    return [
      {
        label: $t('nft-details.purchase-date-lbl'),
        value: formatMDY(props.nftToken.payment.purchaseTimestamp),
      },
      {
        label: $t('nft-details.price-lbl'),
        value: formatFiatAssetFromWei(
          props.nftToken.payment.mintedTokenPrice,
          CURRENCY.USD,
        ),
      },
      {
        label: $t('nft-details.token-amount-lbl'),
        value: formatAssetFromWei(
          props.nftToken.payment.amount,
          props.nftToken.payment.erc20Decimals,
        ),
      },
      {
        label: $t('nft-details.your-token-lbl'),
        value: props.nftToken.payment.erc20Symbol,
      },
      {
        label: $t('nft-details.signature-lbl'),
        value: props.nftToken.signature,
      },
      {
        label: $t('nft-details.document-lbl'),
        value: props.nftToken.payment.bookUrl,
        isUrl: true,
      },
    ] as NftDetails[]
  }

  if (props.nftToken.payment instanceof BookPaymentNftExchangeRecord) {
    return [
      {
        label: $t('nft-details.purchase-date-lbl'),
        value: formatMDY(props.nftToken.payment.purchaseTimestamp),
      },
      {
        label: $t('nft-details.price-lbl'),
        value: formatFiatAssetFromWei(
          props.nftToken.payment.mintedTokenPrice,
          CURRENCY.USD,
        ),
      },
      {
        label: $t('nft-details.floor-price-lbl'),
        value: formatFiatAssetFromWei(
          props.nftToken.payment.floorPrice,
          CURRENCY.USD,
        ),
      },
      {
        label: $t('nft-details.exchanged-nft-address'),
        value: props.nftToken.payment.nftAddress,
      },
      {
        label: $t('nft-details.exchanged-nft-id'),
        value: props.nftToken.payment.nftId,
      },
      {
        label: $t('nft-details.document-lbl'),
        value: props.nftToken.payment.bookUrl,
        isUrl: true,
      },
    ] as NftDetails[]
  }
}

const details: NftDetails[] = getDetails()!
</script>

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
  @include p-body-2;

  color: var(--text-secondary-main);

  @include respond-to(small) {
    font-size: toRem(16);
  }
}

.nft-details__row-value {
  @include p-body-2;

  max-width: 100%;
  word-break: break-word;

  &--document {
    display: flex;
    align-items: center;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    font-weight: inherit;
  }

  &--shortened {
    @include text-ellipsis;
  }

  @include respond-to(small) {
    font-size: toRem(20);
  }
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
