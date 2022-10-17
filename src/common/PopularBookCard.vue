<script lang="ts" setup>
import { AppButton } from '@/common'

import { Book } from '@/types'
import { formatFiatAsset } from '@/helpers'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    book: Book
    actionBtnText?: string
  }>(),
  {
    actionBtnText: '',
  },
)

const { t } = useI18n({ useScope: 'global' })

const bookCardClasses = computed(() => ['popular-book-card'].join(' '))

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
    <div class="popular-book-card__cover-wrp">
      <img
        :src="book.coverUrl"
        :alt="book.title"
        class="popular-book-card__cover"
      />
    </div>
    <span class="popular-book-card__title">
      {{ book.title }}
    </span>
    <span class="popular-book-card__price">
      {{ formatFiatAsset(book.price.amount, book.price.assetCode) }}
    </span>
    <template v-if="$slots.actionButton">
      <slot name="actionButton" />
    </template>
    <template v-else>
      <app-button
        class="popular-book-card__purchase-btn"
        size="small"
        :text="actionButtonText"
        :route="{ name: $routes.bookshelfItem, params: { id: book.id } }"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.popular-book-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  row-gap: toRem(15);
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(12);
  padding: toRem(16) toRem(16) toRem(20);
  max-width: toRem(400);
  background: var(--background-quaternary);
}

.popular-book-card__cover-wrp {
  overflow: hidden;
  width: 100%;
}

.popular-book-card__cover {
  object-fit: cover;
  object-position: center;
  max-height: toRem(370);
  width: 100%;
  height: 100%;
  border-radius: toRem(10);
}

.popular-book-card__title {
  margin-bottom: toRem(15);
  text-align: center;
  color: var(--text-primary-invert-main);
  text-transform: uppercase;
  font-size: toRem(16);
  line-height: 1.25;
  font-weight: 800;
  width: 100%;
}

.popular-book-card__price {
  color: var(--text-primary-invert-main);
  text-transform: uppercase;
  font-size: toRem(20);
  line-height: 1.25;
  font-weight: 900;
  width: 45%;
}

.popular-book-card__purchase-btn {
  min-width: toRem(110);
  width: 45%;
}
</style>
