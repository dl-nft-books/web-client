<template>
  <div :class="bookCardClasses">
    <div class="book-card__cover-wrp">
      <img :src="bannerUrl" :alt="title" class="book-card__cover" />
      <book-card-network
        v-if="network"
        :name="network.name"
        :scheme="getNetworkScheme(network.chain_id.toString())"
      />
    </div>
    <span class="book-card__title">{{ title }}</span>
    <span class="book-card__price">
      <template v-if="price">
        {{ formatFiatAssetFromWei(price, 'USD') }}
      </template>
    </span>
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
import { BookRecord, GeneratedNFtRecord } from '@/records'
import { formatFiatAssetFromWei, getNetworkScheme } from '@/helpers'
import { computed } from 'vue'
import { useContext } from '@/composables'
import { ROUTE_NAMES } from '@/enums'
import { Network } from '@/types'

const props = withDefaults(
  defineProps<{
    book: BookRecord | GeneratedNFtRecord
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

const { $t } = useContext()

const bookCardClasses = computed(() =>
  [
    'book-card',
    `book-card--${props.modification}`,
    `book-card--${props.backgroundColor}`,
  ].join(' '),
)

const actionButtonText = computed(
  () => props.actionBtnText || $t('bookshelf-page.purchase-btn'),
)

const actionButtonLink = computed(() =>
  props.book instanceof GeneratedNFtRecord
    ? { name: ROUTE_NAMES.myNftItem, params: { id: props.book.id } }
    : { name: ROUTE_NAMES.bookshelfItem, params: { id: props.book.id } },
)

const bannerUrl = computed(() =>
  props.book instanceof GeneratedNFtRecord
    ? props.book.imageUrl
    : props.book.bannerUrl,
)

const title = computed(() =>
  props.book instanceof GeneratedNFtRecord ? props.book.name : props.book.title,
)

const price = computed(() =>
  props.book instanceof BookRecord ? props.book.price : '',
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
}

.book-card__cover-wrp {
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
  font-size: toRem(16);
  line-height: 1.25;
  font-weight: 700;
  width: 100%;

  @include text-ellipsis;

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
  text-transform: uppercase;
  font-size: toRem(20);
  line-height: 1.25;
  font-weight: 900;
  width: 45%;

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
}
</style>
