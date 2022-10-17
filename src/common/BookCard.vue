<script lang="ts" setup>
import { AppButton } from '@/common'

import { Book } from '@/types'
import { formatFiatAsset } from '@/helpers'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    book: Book
    scheme?: 'purchase' | 'link'
    modification?: 'centered' | 'default'
    backgroundColor?: 'primary' | 'secondary'
    actionBtnText?: string
  }>(),
  {
    scheme: 'purchase',
    modification: 'default',
    backgroundColor: 'primary',
    actionBtnText: '',
  },
)

const { t } = useI18n({ useScope: 'global' })

const bookCardClasses = computed(() =>
  [
    'book-card',
    `book-card--${props.scheme}`,
    `book-card--${props.modification}`,
    `book-card--${props.backgroundColor}`,
  ].join(' '),
)

const actionButtonText = computed(
  () => props.actionBtnText || t('bookshelf-page.purchase-btn'),
)

/**
 * TODO: if user is own this book nft - then use link to "my nft item page"
 * const actionButtonLink = computed(() => isUserOwnThisBookNft.value
 * ? { name: $routes.myNftItem, params: { id: book.id } }
 * : { name: $routes.bookshelfItem, params: { id: book.id } }
 * )
 */
</script>

<template>
  <div :class="bookCardClasses">
    <div class="book-card__cover-wrp">
      <img :src="book.coverUrl" :alt="book.title" class="book-card__cover" />
    </div>
    <span class="book-card__title">{{ book.title }}</span>
    <span class="book-card__price">
      <template v-if="scheme === 'purchase'">
        {{ formatFiatAsset(book.price.amount, book.price.assetCode) }}
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
        :route="{ name: $routes.bookshelfItem, params: { id: book.id } }"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.book-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  row-gap: toRem(24);
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(12);
  padding: toRem(16) toRem(16) toRem(20);
  min-width: toRem(292);

  &--primary {
    background: var(--background-tertiary);
  }

  &--secondary {
    background: var(--background-quaternary);
  }
}

.book-card__cover-wrp {
  overflow: hidden;
  width: 100%;
}

.book-card__cover {
  object-fit: cover;
  object-position: center;
  max-height: toRem(200);
  width: 100%;
  height: 100%;
}

.book-card__title {
  text-transform: uppercase;
  font-size: toRem(16);
  line-height: 1.25;
  font-weight: 700;
  width: 100%;

  .book-card--centered & {
    text-align: center;
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

  .book-card--secondary & {
    color: var(--text-primary-invert-main);
  }
}

.book-card__purchase-btn {
  min-width: toRem(110);
  width: 45%;
}
</style>
