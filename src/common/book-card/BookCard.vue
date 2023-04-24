<template>
  <div :class="bookCardClasses">
    <div class="book-card__cover-wrp">
      <img :src="bannerUrl" :alt="title" class="book-card__cover" />
      <book-card-network
        v-if="network"
        :name="network.name"
        :scheme="getNetworkScheme(network.chain_id)"
      />
    </div>
    <h5 class="book-card__title">
      {{ title }}
    </h5>
    <h4 v-if="price" class="book-card__price">
      {{ formatFiatAssetFromWei(price, CURRENCIES.USD) }}
    </h4>
    <template v-if="$slots.actionButton">
      <slot name="actionButton" />
    </template>
    <template v-else>
      <app-button
        class="book-card__purchase-btn"
        size="x-small"
        :text="actionButtonText"
        :route="actionButtonLink"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, BookCardNetwork } from '@/common'
import { formatFiatAssetFromWei, getNetworkScheme } from '@/helpers'
import { computed } from 'vue'
import { BaseBookInfo, TokenBaseInfo, useNftTokens } from '@/composables'
import { Network } from '@/types'
import { ROUTE_NAMES, CURRENCIES } from '@/enums'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    book: BaseBookInfo | TokenBaseInfo
    modification?: 'centered' | 'default'
    backgroundColor?: 'primary' | 'secondary' | 'tertiary'
    actionBtnText?: string
    network?: Network | null
  }>(),
  {
    modification: 'default',
    backgroundColor: 'primary',
    actionBtnText: '',
    network: null,
  },
)

const { t } = useI18n()
const { isNftToken } = useNftTokens()

const bookCardClasses = computed(() =>
  [
    'book-card',
    `book-card--${props.modification}`,
    `book-card--${props.backgroundColor}`,
    ...(price.value ? [] : ['book-card--right']),
  ].join(' '),
)

const actionButtonText = computed(
  () => props.actionBtnText || t('bookshelf-page.purchase-btn'),
)

const actionButtonLink = computed(() =>
  isNftToken(props.book)
    ? {
        name: ROUTE_NAMES.myNftItem,
        params: {
          id: props.book.tokenId,
          contractAddress: props.book.tokenContract,
        },
      }
    : { name: ROUTE_NAMES.bookshelfItem, params: { id: props.book.id } },
)

const bannerUrl = computed(() =>
  isNftToken(props.book)
    ? props.book.metadata.image
    : props.book.banner.attributes.url,
)

const title = computed(() =>
  isNftToken(props.book) ? props.book.metadata.name : props.book.tokenName,
)

const price = computed(() =>
  isNftToken(props.book) ? '' : props.book.pricePerOneToken,
)
</script>

<style lang="scss" scoped>
.book-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  row-gap: toRem(24);
  border: toRem(1) solid var(--border-black);
  border-radius: toRem(12);
  padding: toRem(16) toRem(16) toRem(20);

  &--primary {
    background: var(--background-secondary);
  }

  &--secondary {
    background: var(--background-quaternary);
  }

  &--tertiary {
    background: var(--background-tertiary);
    border: toRem(1) solid var(--border-primary-main);
  }

  &--right {
    justify-content: flex-end;
  }
}

.book-card__cover-wrp {
  display: flex;
  overflow: hidden;
  width: 100%;
  position: relative;
}

.book-card__cover {
  object-fit: cover;
  object-position: top center;
  max-height: toRem(280);
  border-radius: toRem(12);
  width: 100%;
  height: 100%;
}

.book-card__title {
  text-transform: uppercase;
  width: 100%;
  word-wrap: break-word;

  .book-card--centered & {
    text-align: center;
  }

  .book-card--primary & {
    color: var(--text-primary-invert-light);
  }

  .book-card--secondary & {
    color: var(--text-primary-invert-main);
  }
}

.book-card__price {
  width: 45%;

  @include text-ellipsis;

  .book-card--primary & {
    color: var(--text-primary-invert-light);
  }

  .book-card--secondary & {
    color: var(--text-primary-invert-main);
  }
}

.book-card__purchase-btn {
  min-width: toRem(110);
  width: 45%;
  text-transform: uppercase;
  font-weight: 700;
}
</style>
