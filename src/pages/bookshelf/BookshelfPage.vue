<template>
  <div class="bookshelf-page">
    <bookshelf-cubes />
    <bookshelf-header />
    <section class="bookshelf-page__title-wrapper">
      <h3 class="bookshelf-page__title">
        {{ $t('bookshelf-page.title') }}
      </h3>
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
          :network="networkStore.getNetworkByID(book.chain_id)"
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
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash'

import {
  Loader,
  ErrorMessage,
  NoDataMessage,
  BookCard,
  AppButton,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { BaseBookInfo, useBooks, useContractPagination } from '@/composables'
import { BookshelfHeader, BookshelfCubes } from '@/pages/bookshelf'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import { config } from '@/config'

const networkStore = useNetworksStore()
const webProvidersStore = useWeb3ProvidersStore()

const provider = computed(() => webProvidersStore.provider)

const { getBooksFromContract } = useBooks()

const isLoadFailed = ref(false)
const books = ref<BaseBookInfo[]>([])

const searchByString = ref('')
const searchModel = ref('')

const loadList = computed(
  () => (limit: number, offset: number) =>
    getBooksFromContract(
      limit,
      offset,
      provider.value.chainId ?? config.DEFAULT_CHAIN_ID,
    ),
)

const { loadNextPage, isLoading, isLoadMoreBtnShown } = useContractPagination(
  loadList,
  setList,
  concatList,
  onError,
)

function setList(chunk: BaseBookInfo[]) {
  books.value = chunk ? chunk.filter(book => !book.isDisabled) : []
}

function concatList(chunk: BaseBookInfo[]) {
  books.value = books.value.concat(
    chunk ? chunk.filter(book => !book.isDisabled) : [],
  )
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}

watch(
  searchModel,
  debounce(() => {
    searchByString.value = searchModel.value
  }, 200),
)
</script>

<style lang="scss" scoped>
.bookshelf-page {
  gap: toRem(34);
  padding-top: toRem(200);
  padding-bottom: toRem(200);
  position: relative;
  z-index: var(--z-index-layer-2);
  margin-top: toRem(-220);
  background-color: var(--black);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Chain image */
  &:before {
    content: '';
    position: absolute;
    width: 100vw;
    top: toRem(110);
    left: 0;
    z-index: var(--z-index-layer-1);
    height: vh(100);
    background: url('/images/cubes.png') no-repeat right top / contain;
    background-size: clamp(toRem(250), 45%, toRem(800));

    @include respond-to(medium) {
      background-size: toRem(450);
      top: toRem(280);
    }

    @include respond-to(small) {
      background-size: toRem(250);
      top: toRem(400);
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
    z-index: var(--z-index-layer-bottom);

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
      height: 205vw;
    }
  }
}

.bookshelf-page__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: toRem(20);

  @include respond-to(small) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.bookshelf-page__title {
  text-transform: uppercase;
  position: relative;
  color: var(--text-primary-invert-main);

  @include text-shadow;

  &:after {
    content: ' ';
    position: absolute;
    top: toRem(50);
    left: 0;
    width: toRem(120);
    height: toRem(2);
    background-color: var(--primary-main);

    @include respond-to(medium) {
      width: toRem(60);
      top: toRem(40);
    }
  }

  @include respond-to(medium) {
    font-size: toRem(24);
  }
}

.bookshelf-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(toRem(292), 1fr));
  grid-gap: toRem(20);
  position: relative;
  z-index: var(--z-index-layer-2);
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
