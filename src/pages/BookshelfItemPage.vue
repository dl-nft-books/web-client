<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  AppButton,
  PurchasingModal,
  PurchasingSuccessModal,
  NftDescription,
} from '@/common'

import { ErrorHandler, getBookById } from '@/helpers'
import { ref, watch } from 'vue'
import { formatFiatAssetFromWei } from '@/helpers'
import { BookRecord } from '@/records'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  id: string
}>()
const { provider } = storeToRefs(useWeb3ProvidersStore())
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const isPurchaseModalShown = ref(false)
const isPurchaseSuccessModalShown = ref(false)

const book = ref<BookRecord | undefined>()

const submit = async () => {
  try {
    isPurchaseModalShown.value = false
    isPurchaseSuccessModalShown.value = true
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const init = async () => {
  try {
    const bookResponse = await getBookById(props.id)
    book.value = new BookRecord(bookResponse)
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

watch(
  () => provider.value.isConnected,
  value => {
    if (!value) {
      isPurchaseModalShown.value = false
    }
  },
)

init()
</script>

<template>
  <div class="bookshelf-item-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('bookshelf-item-page.loading-error-msg')" />
      </template>
      <template v-else-if="book">
        <div class="bookshelf-item-page__cover-wrp">
          <img
            :src="book.bannerUrl"
            :alt="book.title"
            class="bookshelf-item-page__cover"
          />
        </div>
        <div class="bookshelf-item-page__details">
          <h2 class="bookshelf-item-page__title">
            {{ book.title }}
          </h2>
          <div class="bookshelf-item-page__actions">
            <div class="bookshelf-item-page__price">
              {{ formatFiatAssetFromWei(book.price, 'USD') }}
            </div>
            <template v-if="provider.isConnected">
              <app-button
                class="bookshelf-item-page__purchase-btn"
                :text="$t('bookshelf-item-page.purchase-btn')"
                @click="isPurchaseModalShown = true"
              />
            </template>
            <template v-else>
              <app-button
                class="bookshelf-item-page__purchase-btn"
                :text="$t('bookshelf-item-page.connect-btn')"
                @click="provider.connect"
              />
            </template>
          </div>
          <nft-description :description="book.description" />
        </div>
        <template v-if="book && isPurchaseModalShown">
          <purchasing-modal
            v-model:is-shown="isPurchaseModalShown"
            :book="book"
            @submit="submit"
          />
        </template>
        <purchasing-success-modal
          v-model:is-shown="isPurchaseSuccessModalShown"
        />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bookshelf-item-page {
  $left-column: clamp(#{toRem(200)}, 40%, #{toRem(600)});
  $right-column: clamp(#{toRem(250)}, 55%, #{toRem(700)});

  display: grid;
  width: 100%;
  grid-template-columns: $left-column $right-column;
  grid-column-gap: clamp(#{toRem(10)}, 5%, #{toRem(80)});
  padding-top: toRem(40);
  padding-bottom: toRem(100);
  justify-content: center;
  background: url('/images/background-cubes.png') no-repeat left bottom /
    contain;

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    row-gap: toRem(40);
  }

  @include respond-to(small) {
    max-width: 100%;
  }
}

.bookshelf-item-page__cover-wrp {
  max-width: 100%;
}

.bookshelf-item-page__cover {
  width: 100%;
  height: auto;
  filter: var(--cover-image-shadow);

  @include respond-to(medium) {
    display: block;
    width: auto;
    max-height: toRem(500);
    max-width: 100%;
    margin: 0 auto;
  }
}

.bookshelf-item-page__details {
  display: flex;
  flex-direction: column;
}

.bookshelf-item-page__title {
  text-transform: uppercase;
  font-size: toRem(48);
  line-height: 1.2;
  font-weight: 900;
  margin-bottom: toRem(65);

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(30);
  }
}

.bookshelf-item-page__actions {
  display: flex;
  align-items: center;
  gap: toRem(20);
  border-bottom: toRem(1) solid var(--border-primary-main);
  padding-bottom: toRem(36);
  margin-bottom: toRem(40);

  @include respond-to(small) {
    flex-direction: column;
  }
}

.bookshelf-item-page__price {
  text-transform: uppercase;
  font-size: toRem(48);
  line-height: 1.2;
  font-weight: 900;

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(30);
  }
}

.bookshelf-item-page__purchase-btn {
  min-width: toRem(300);
  margin-left: auto;

  @include respond-to(small) {
    margin: 0 auto;
    min-width: toRem(240);
  }
}

.bookshelf-item-page__description {
  font-size: toRem(25);
  line-height: 1.2;
  font-weight: 400;

  @include respond-to(medium) {
    font-size: toRem(18);
  }
}
</style>
