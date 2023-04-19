<template>
  <div :class="bookCardClasses">
    <div class="book-card__cover-wrp">
      <img :src="bannerUrl" :alt="title" class="book-card__cover" />
      <book-card-network
        v-if="!isNftToken(book)"
        :networks="formatNetworks()"
      />
    </div>
    <h5 class="book-card__title">
      {{ title }}
    </h5>
    <footer class="book-card__footer">
      <h4 v-if="price" class="book-card__price">
        {{ formatFiatAssetFromWei(price, CURRENCIES.USD) }}
      </h4>

      <app-button
        class="book-card__purchase-btn"
        size="x-small"
        :text="actionButtonText"
        :route="actionButtonLink"
      />
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, BookCardNetwork } from '@/common'
import { formatFiatAssetFromWei, getNetworkScheme } from '@/helpers'
import { computed } from 'vue'
import { BaseBookInfo, TokenBaseInfo, useNftTokens } from '@/composables'
import { ROUTE_NAMES, CURRENCIES, NETWORKS } from '@/enums'
import { useI18n } from 'vue-i18n'

type SCHEME = 'book' | 'nft'

const props = withDefaults(
  defineProps<{
    book: BaseBookInfo | TokenBaseInfo
    modification?: 'centered' | 'default'
    actionBtnText?: string
    scheme?: SCHEME
  }>(),
  {
    modification: 'default',
    backgroundColor: 'primary',
    actionBtnText: '',
    network: null,
    scheme: 'nft',
  },
)

const { t } = useI18n()
const { isNftToken } = useNftTokens()

const bookCardClasses = computed(() =>
  [
    'book-card',
    `book-card--${props.modification}`,
    `book-card--${props.scheme}`,
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
        params: { id: props.book.tokenId, contract: props.book.tokenContract },
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

const formatNetworks = (): NETWORKS[] => {
  return isNftToken(props.book)
    ? []
    : props.book.networks.map(network =>
        getNetworkScheme(network.attributes.chain_id),
      )
}
</script>

<style lang="scss" scoped>
.book-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  row-gap: toRem(24);
  border-radius: toRem(12);
  padding: toRem(16) toRem(16) toRem(20);
  background-color: var(--background-primary-main);
  border: toRem(1) solid var(--border-primary-main);

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
  max-height: toRem(220);
  border-radius: toRem(5);
  width: 100%;
  height: 100%;
}

.book-card__title {
  text-transform: uppercase;
  width: 100%;
  word-wrap: break-word;
  line-height: toRem(20);
  font-weight: 700;

  .book-card--centered & {
    text-align: center;
  }
}

.book-card__price {
  width: 45%;
  font-weight: 700;

  @include text-ellipsis;
}

.book-card__purchase-btn {
  width: 100%;
  height: toRem(38);
  text-transform: uppercase;
  font-weight: 700;
}

.book-card__footer {
  width: 100%;
  display: flex;
  justify-content: space-between;

  & > *:nth-child(2) {
    flex-basis: 45%;
  }
}
</style>
