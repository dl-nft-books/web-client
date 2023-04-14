<template>
  <div class="bookshelf-page">
    <bookshelf-header />
    <h1 class="bookshelf-page__title">
      {{ $t('bookshelf-page.title') }}
    </h1>

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

      <div class="bookshelf-page__loader">
        <loader v-if="isLoading" />
      </div>

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
    <img
      class="bookshelf-page__background bookshelf-page__background--bottom"
      src="/images/fancy-lines.png"
    />
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
import { BookshelfHeader } from '@/pages/bookshelf'
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
  margin-top: toRem(-220);
  background-color: var(--background-primary-dark);
  position: relative;
  z-index: var(--z-index-layer-2);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  // /* Chain image */
  // &:before {
  //   content: '';
  //   position: absolute;
  //   width: 100vw;
  //   top: toRem(110);
  //   left: 0;
  //   z-index: var(--z-index-layer-1);
  //   height: vh(100);
  //   background: url('/images/cubes.png') no-repeat right top / contain;
  //   background-size: clamp(toRem(250), 45%, toRem(800));

  //   @include respond-to(medium) {
  //     background-size: toRem(450);
  //     top: toRem(280);
  //   }

  //   @include respond-to(small) {
  //     background-size: toRem(250);
  //     top: toRem(400);
  //   }
  // }
}

.bookshelf-page__title {
  text-transform: uppercase;
}

.bookshelf-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, toRem(292));
  grid-gap: toRem(20);
  justify-content: space-evenly;
}

.bookshelf-page__load-more-btn {
  margin: toRem(20) auto 0;
  width: toRem(240);
  color: var(--white);
  border: toRem(2) solid var(--white);

  --app-button-flat-text-hover: var(--primary-light);
  --app-button-flat-border: #{toRem(2)} solid var(--primary-light);
}

.bookshelf-page__background {
  @include background-image;
}
</style>
