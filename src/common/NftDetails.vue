<template>
  <div class="nft-details">
    <div v-for="(item, index) in details" :key="index" class="nft-details__row">
      <p class="nft-details__row-label">
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
            'nft-details__row-value--shortened',
          ]"
        >
          {{ item.value }}
        </span>
        <icon class="nft-details__row-icon" :name="$icons.download" />
      </a>
      <p v-else class="nft-details__row-value">
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
  globalizeTokenType,
} from '@/helpers'

import { CURRENCIES, TOKEN_TYPES } from '@/enums'
import { TokenFullInfo } from '@/types'
import { useI18n } from 'vue-i18n'

type NftDetails = {
  label: string
  value: string
  isUrl?: boolean
}

const props = defineProps<{
  nftToken: TokenFullInfo
}>()

const { t } = useI18n()

const getDetails = () => {
  if (!props.nftToken.payment) return []

  let commonDetails: NftDetails[] = [
    {
      label: t('nft-details.purchase-date-lbl'),
      value: formatMDY(props.nftToken.payment.purchase_timestamp),
    },
    {
      label: t('nft-details.price-lbl'),
      value: formatFiatAssetFromWei(
        props.nftToken.payment.minted_token_price,
        CURRENCIES.USD,
      ),
    },
    {
      label: t('nft-details.payment-type-lbl'),
      value: globalizeTokenType(props.nftToken.payment.type),
    },
  ]

  if (props.nftToken.payment.type !== TOKEN_TYPES.nft) {
    commonDetails = commonDetails.concat([
      {
        label: t('nft-details.token-amount-lbl'),
        value: !Number(props.nftToken.payment.amount)
          ? '0.0'
          : formatAssetFromWei(
              props.nftToken.payment.amount,
              props.nftToken.payment.erc20_data.decimals,
            ),
      },
      {
        label: t('nft-details.your-token-lbl'),
        value: props.nftToken.payment.erc20_data.symbol,
      },
    ] as NftDetails[])
  }

  if (props.nftToken.payment.type === TOKEN_TYPES.nft) {
    commonDetails = commonDetails.concat([
      {
        label: t('nft-details.exchanged-nft-address'),
        value: props.nftToken.payment.erc20_data.address,
      },
    ] as NftDetails[])
  }

  commonDetails = commonDetails.concat([
    {
      label: t('nft-details.document-lbl'),
      value: props.nftToken.metadata.external_url,
      isUrl: true,
    },
  ])

  return commonDetails
}

const details: NftDetails[] = getDetails()
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
    grid-template-columns: 55% 1fr;
    grid-gap: toRem(10);
  }
}

.nft-details__row-label {
  background-color: var(--background-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(14);
  display: flex;
  align-items: center;

  @include respond-to(small) {
    font-size: toRem(15);
  }
}

.nft-details__row-value {
  background-color: var(--background-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(14);
  display: flex;
  align-items: center;
  max-width: 100%;
  word-break: break-word;

  &--document {
    display: flex;
    align-items: center;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    font-weight: inherit;
    padding: 0;
    padding-right: toRem(14);
  }

  &--shortened {
    @include text-ellipsis;
  }

  @include respond-to(small) {
    font-size: toRem(15);
  }
}

.nft-details__row-icon {
  display: inline-block;
  width: toRem(24);
  height: toRem(24);
  min-width: toRem(24);
  color: var(--primary-main);
  margin-left: toRem(10);

  @include respond-to(small) {
    width: toRem(18);
    height: toRem(18);
  }
}
</style>
