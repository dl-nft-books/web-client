<template>
  <div class="book-details">
    <div
      v-for="(item, index) in details"
      :key="index"
      class="book-details__row"
    >
      <p class="book-details__row-label">
        {{ item.label }}
      </p>

      <div
        class="book-details__row-value"
        :class="{ 'book-details__row-value--highlighted': item.hightlighted }"
      >
        <icon
          v-if="item.icon"
          class="book-details__row-icon"
          :name="item.icon"
        />
        <p v-if="item.value">
          {{ item.value }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import { formatFiatAssetFromWei } from '@/helpers'

import { CURRENCIES, ICON_NAMES } from '@/enums'
import { FullBookInfo } from '@/composables'
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'

type BookDetails = {
  label: string
  value?: string
  icon?: ICON_NAMES
  hightlighted?: boolean
}

const props = defineProps<{ book: FullBookInfo }>()

const { t } = useI18n()

const getDetails = (): BookDetails[] => {
  return [
    {
      label: t('book-details.voucher-token-lbl'),
      icon:
        props.book.voucherTokenContract !== ethers.constants.AddressZero
          ? ICON_NAMES.okCircle
          : ICON_NAMES.deleteCircle,
    },
    {
      label: t('book-details.nft-lbl'),
      icon: props.book.isNFTBuyable
        ? ICON_NAMES.okCircle
        : ICON_NAMES.deleteCircle,
    },

    {
      label: t('book-details.floor-price-lbl'),
      value: props.book.isNFTBuyable
        ? formatFiatAssetFromWei(props.book.minNFTFloorPrice, CURRENCIES.USD)
        : '',
    },
    {
      label: t('book-details.price-lbl'),
      value: formatFiatAssetFromWei(
        props.book.pricePerOneToken,
        CURRENCIES.USD,
      ),
      hightlighted: true,
    },
  ]
}

const details: BookDetails[] = getDetails().filter(
  el => Boolean(el.value) || Boolean(el.icon),
)
</script>

<style lang="scss" scoped>
.book-details {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.book-details__row {
  display: grid;
  grid-template-columns: 70% 1fr;
  grid-gap: toRem(20);

  @include respond-to(small) {
    grid-template-columns: 1fr;
    grid-gap: toRem(10);
  }
}

.book-details__row-label {
  background-color: var(--background-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(14);
  display: flex;
  align-items: center;

  @include respond-to(small) {
    font-size: toRem(16);
  }
}

.book-details__row-value {
  background-color: var(--background-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(14);
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  word-break: break-word;

  &--highlighted {
    --highlighted-color: #{rgba(var(--primary-main-rgb), 0.7)};

    background-color: var(--highlighted-color);
  }

  &--shortened {
    @include text-ellipsis;
  }
}

.book-details__row-icon {
  display: inline-block;
  width: toRem(24);
  height: toRem(24);
  min-width: toRem(24);
  color: var(--primary-main);
}
</style>
