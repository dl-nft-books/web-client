<script lang="ts" setup>
import { AppButton, Icon } from '@/common'

import { BookRecord, GeneratedNFtRecord } from '@/records'
import { formatFiatAssetFromWei } from '@/helpers'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ROUTE_NAMES } from '@/enums'

const props = withDefaults(
  defineProps<{
    book: BookRecord | GeneratedNFtRecord
    modification?: 'centered' | 'default'
    backgroundColor?: 'primary' | 'secondary'
    actionBtnText?: string
  }>(),
  {
    modification: 'default',
    backgroundColor: 'primary',
    actionBtnText: '',
  },
)

const { t } = useI18n({ useScope: 'global' })

const bookCardClasses = computed(() =>
  [
    'book-card',
    `book-card--${props.modification}`,
    `book-card--${props.backgroundColor}`,
  ].join(' '),
)

const actionButtonText = computed(
  () => props.actionBtnText || t('bookshelf-page.purchase-btn'),
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

<template>
  <div :class="bookCardClasses">
    <div class="book-card__cover-wrp">
      <img :src="bannerUrl" :alt="title" class="book-card__cover" />
      <!-- For now its hardcoded value. Will be changed in future updates -->
      <div class="book-card__network">
        <icon class="book-card__icon" :name="$icons.polygon" />
        <p class="book-card__network-name">
          {{ $t('networks.polygon') }}
        </p>
      </div>
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
}

.book-card__cover-wrp {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.book-card__network {
  background-color: var(--text-primary-main);
  width: fit-content;
  height: toRem(31);
  padding: 0 toRem(10);
  position: absolute;
  bottom: toRem(4);
  right: 0;
  border-radius: toRem(12) 0 toRem(12) 0;
  display: flex;
  align-items: center;
  gap: toRem(10);
}

.book-card__network-name {
  font-weight: 400;
  font-size: toRem(15);
  line-height: toRem(16);
  padding-top: toRem(2);
  color: var(--white);
}

.book-card__icon {
  max-width: toRem(18);
  max-height: toRem(16);
  color: var(--primary-main);
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
  color: var(--white);

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
  color: var(--white);

  .book-card--secondary & {
    color: var(--text-primary-invert-main);
  }
}

.book-card__purchase-btn {
  min-width: toRem(110);
  width: 45%;
}
</style>
