<template>
  <div class="book-details">
    <div
      v-for="(item, index) in details"
      :key="index"
      class="book-details__row"
    >
      <p
        class="book-details__row-label"
        :class="{
          'book-details__row-label--row-span': item.rowSpan,
        }"
      >
        {{ item.label }}
      </p>

      <div
        class="book-details__row-value"
        :class="{
          'book-details__row-value--highlighted': item.hightlighted,
          'book-details__row-value--row-span': item.rowSpan,
        }"
      >
        <template v-if="item.icons?.length">
          <icon
            v-for="icon in item.icons"
            :key="icon"
            class="book-details__row-icon"
            :name="icon"
          />
        </template>

        <p
          v-if="item.value"
          class="book-details__row-value-item"
          :class="{
            'book-details__row-value-item--iconed': item.icons?.length,
          }"
        >
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
import { getNetworkScheme, getIconByScheme } from '@/helpers'
import { useI18n } from 'vue-i18n'

type BookDetails = {
  label: string
  value?: string
  icons?: ICON_NAMES[]
  hightlighted?: boolean
  rowSpan?: boolean
}

const props = defineProps<{ book: FullBookInfo }>()

const { t } = useI18n()

const getNetworkIcon = (chainId: number): ICON_NAMES => {
  const scheme = getNetworkScheme(chainId)

  return getIconByScheme(scheme, 'circle')
}

const MAX_PRICE_LENGTH = 5

const getDetails = (): BookDetails[] => {
  const formattedFloorPrice = props.book.isNFTBuyable
    ? formatFiatAssetFromWei(props.book.minNFTFloorPrice, CURRENCIES.USD)
    : ''
  const formattedPrice = formatFiatAssetFromWei(
    props.book.pricePerOneToken,
    CURRENCIES.USD,
  )

  return [
    {
      label: t('book-details.network-lbl'),
      icons: props.book.networks.map(el =>
        getNetworkIcon(el.attributes.chain_id),
      ),
    },
    {
      label: t('book-details.voucher-token-lbl'),
      icons: [
        props.book.isVoucherBuyable
          ? ICON_NAMES.okCircle
          : ICON_NAMES.deleteCircle,
      ],
    },
    {
      label: t('book-details.nft-lbl'),
      icons: [
        props.book.isNFTBuyable ? ICON_NAMES.okCircle : ICON_NAMES.deleteCircle,
      ],
    },

    {
      label: t('book-details.floor-price-lbl'),
      value: formattedFloorPrice,
      rowSpan: formattedFloorPrice.length > MAX_PRICE_LENGTH,
    },
    {
      label: t('book-details.price-lbl'),
      value: formattedPrice,
      hightlighted: true,
      rowSpan: formattedPrice.length > MAX_PRICE_LENGTH,
    },
  ]
}

const details: BookDetails[] = getDetails().filter(
  el => Boolean(el.value) || Boolean(el.icons?.length),
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
}

.book-details__row-label {
  background-color: var(--background-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(14);
  display: flex;
  align-items: center;

  @include respond-to(small) {
    &--row-span {
      grid-column: 1 / -1;
    }
  }

  @include respond-to(small) {
    font-size: toRem(16);
  }
}

.book-details__row-value {
  background-color: var(--background-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(14);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  gap: toRem(15);
  max-width: 100%;
  word-break: break-word;

  &--highlighted {
    --highlighted-color: #{rgba(var(--primary-main-rgb), 0.7)};

    background-color: var(--highlighted-color);
  }

  @include respond-to(small) {
    &--row-span {
      grid-column: 1 / -1;
    }
  }

  &--shortened {
    @include text-ellipsis;
  }
}

.book-details__row-icon {
  --icon-size: #{toRem(24)};

  width: var(--icon-size);
  height: var(--icon-size);
  color: var(--primary-light);
}

.book-details__row-value-item {
  &--iconed {
    @include respond-to(small) {
      display: none;
    }
  }
}
</style>
