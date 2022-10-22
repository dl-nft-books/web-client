<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  AppButton,
  PurchasingModal,
  PurchasingSuccessModal,
  NftDescription,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { Book } from '@/types'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { formatFiatAsset } from '@/helpers'

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const isPurchaseModalShown = ref(false)
const isPurchaseSuccessModalShown = ref(false)

const book = ref<Book | undefined>()

const route = useRoute()

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
    await loadBook()
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const loadBook = async () => {
  book.value = {
    id: route.params.id,
    title: 'Blockchain and decentralized systems, Volume 1',
    price: {
      amount: 109,
      assetCode: 'USD',
    },
    coverUrl:
      'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80',
    description:
      'Lörem ipsum semiskop plaktig. Bent abvalens trera vipysamma. Rerade prer derade. Digisk nebelt fask. sdscqae \n' +
      'Mack nitevis. Mikropp antelånas londe. Tism svenna sitt liv i preliga. Sögisk euroråse belig. \n' +
      'Pögt ont puhet och supravinade. Dis vil gesåbelt och vaheten. Aning elektrogram eftersom miligen. Renyde korat. \n',
    meta: {
      volume: 'Volume 2',
    },
  } as Book
}

init()
</script>

<template>
  <div class="bookshelf-item-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('bookshelf-item-page.loading-error-msg')" />
      </template>
      <template v-else>
        <div class="bookshelf-item-page__cover-wrp">
          <img
            :src="book.coverUrl"
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
              {{ formatFiatAsset(book.price.amount, book.price.assetCode) }}
            </div>
            <app-button
              class="bookshelf-item-page__purchase-btn"
              :text="$t('bookshelf-item-page.purchase-btn')"
              @click="isPurchaseModalShown = true"
            />
          </div>
          <nft-description :description="book.description" />
        </div>
        <template v-if="book">
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
