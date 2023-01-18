<template>
  <div class="bookshelf-page">
    <bookshelf-cubes />
    <bookshelf-header />
    <section class="bookshelf-page__title-wrapper">
      <h2 class="bookshelf-page__title">
        {{ $t('bookshelf-page.title') }}
      </h2>
      <bookshelf-network-switcher v-model:chain-id="currentNetworkChainId" />
    </section>
    <error-message
      v-if="isLoadFailed"
      :message="$t('bookshelf-page.loading-error-msg')"
    />
    <template v-else-if="books.length || isLoading">
      <div v-if="books.length" class="bookshelf-page__list">
        <book-card
          v-for="book in books"
          :key="book.id"
          :book="book"
          :network="networkStore.getNetworkByID(book.chainID)"
        />
      </div>

      <loader v-if="isLoading" />

      <app-button
        v-if="isLoadMoreBtnShown"
        class="bookshelf-page__load-more-btn"
        size="small"
        scheme="flat"
        color="primary"
        :text="$t('bookshelf-page.load-more-btn')"
        @click="loadNextPage"
      />
    </template>
    <no-data-message v-else :message="$t('bookshelf-page.no-data-msg')" />
  </div>
</template>

<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  NoDataMessage,
  BookCard,
  AppButton,
  BookshelfNetworkSwitcher,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { BookRecord } from '@/records'
import { ref, computed, watch } from 'vue'
import { BOOK_DEPLOY_STATUSES } from '@/enums'
import { getBooks } from '@/api'
import { usePaginate } from '@/composables'
import { Book, ChainId } from '@/types'
import { BookshelfHeader, BookshelfCubes } from '@/pages/Bookshelf'
import { useNetworksStore } from '@/store'

const isLoadFailed = ref(false)
const books = ref<BookRecord[]>([])

//TODO switcher works weird
const networkStore = useNetworksStore()
const currentNetworkChainId = ref<ChainId>(
  networkStore.isLoaded ? networkStore.list[0].chain_id : 0,
)

watch(
  () => networkStore.isLoaded,
  () => {
    currentNetworkChainId.value = networkStore.list[0].chain_id
  },
)

const loadList = computed(
  () => () =>
    getBooks({
      deployStatus: [BOOK_DEPLOY_STATUSES.successful],
      chainId: currentNetworkChainId.value,
    }),
)

const { loadNextPage, isLoading, isLoadMoreBtnShown } = usePaginate(
  loadList,
  setList,
  concatList,
  onError,
)

function setList(chunk: Book[]) {
  books.value = chunk.map(book => new BookRecord(book)) ?? []
}

function concatList(chunk: Book[]) {
  books.value = books.value.concat(
    chunk.map(book => new BookRecord(book)) ?? [],
  )
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}
</script>

<style lang="scss" scoped>
.bookshelf-page {
  display: flex;
  flex-direction: column;
  gap: toRem(34);
  padding-top: toRem(200);
  padding-bottom: toRem(200);
  position: relative;
  z-index: var(--page-index);
  margin-top: toRem(-220);
  background-color: var(--black);

  /* Chain image */
  &:before {
    content: '';
    position: absolute;
    width: 100vw;
    top: toRem(110);
    left: 0;
    z-index: var(--chain-index);
    height: vh(100);
    background: url('/images/cubes.png') no-repeat right top / contain;
    background-size: 45%;

    @include respond-to(medium) {
      background-size: toRem(450);
      top: toRem(280);
    }

    @include respond-to(small) {
      display: none;
    }
  }

  /* White bg under the header */
  &:after {
    content: '';
    position: absolute;
    top: toRem(-600);
    left: toRem(-42);
    transform: rotate(-10deg);
    width: 120vw;
    height: toRem(1100);
    background-size: 45%;
    background-color: var(--white);
    border-radius: toRem(300);
    z-index: var(--bg-index);

    @include respond-to(medium) {
      left: toRem(-60);
      width: 160vw;
      top: toRem(-580);
    }

    @include respond-to(small) {
      top: toRem(-250);
      left: toRem(-60);
      width: 160vw;
      border-radius: toRem(200);
      height: 195vw;
    }
  }
}

.bookshelf-page__title-wrapper {
  display: flex;
  justify-content: space-between;

  @include respond-to(medium) {
    flex-direction: column;
    align-items: center;
    gap: toRem(15);
  }
}

.bookshelf-page__title {
  text-transform: uppercase;
  font-size: toRem(40);
  line-height: toRem(50);
  font-weight: 700;
  color: var(--white);
  position: relative;
  text-shadow: toRem(-1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(-1) 0 var(--text-primary-main),
    toRem(-1) toRem(-1) 0 var(--text-primary-main);

  &:after {
    content: ' ';
    position: absolute;
    top: toRem(50);
    left: 0;
    width: toRem(220);
    height: toRem(2);
    background-color: var(--primary-main);
  }
}

.bookshelf-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(toRem(292), 1fr));
  grid-gap: toRem(20);
  position: relative;
  z-index: var(--page-index);
}

.bookshelf-page__load-more-btn {
  margin: toRem(20) auto 0;
  width: toRem(240);
  color: var(--white);
  border: toRem(2) solid var(--white);

  --app-button-flat-text-hover: var(--primary-light);
  --app-button-flat-border: #{toRem(2)} solid var(--primary-light);
}
</style>
