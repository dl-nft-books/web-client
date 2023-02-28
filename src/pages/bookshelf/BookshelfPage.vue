<template>
  <div class="bookshelf-page">
    <bookshelf-cubes />
    <bookshelf-header />
    <section class="bookshelf-page__title-wrapper">
      <h3 class="bookshelf-page__title">
        {{ $t('bookshelf-page.title') }}
      </h3>
      <div class="bookshelf-page__actions">
        <bookshelf-network-switcher
          v-show="isFilterVisible"
          v-model="currentNetworkChainId"
        />
        <input-field
          v-model="searchModel"
          class="bookshelf-page__actions-search"
          :class="{
            'bookshelf-page__actions-search--full-width': !isFilterVisible,
          }"
          schemes="icon-left"
          :modifications="searchFieldModifications"
          :placeholder="$t('bookshelf-page.search-placeholder')"
          :icon-name="$icons.search"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        />
      </div>
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
  BookshelfNetworkSwitcher,
} from '@/common'
import { InputField } from '@/fields'
import { ErrorHandler } from '@/helpers'
import { BOOK_DEPLOY_STATUSES, WINDOW_BREAKPOINTS } from '@/enums'
import { usePaginate, useBooks } from '@/composables'
import { Book, ChainId } from '@/types'
import { BookshelfHeader, BookshelfCubes } from '@/pages/bookshelf'
import { useNetworksStore } from '@/store'
import { useWindowSize } from '@vueuse/core'

const networkStore = useNetworksStore()
const { width } = useWindowSize()
const { getBooks } = useBooks()

const isLoadFailed = ref(false)
const books = ref<Book[]>([])
const currentNetworkChainId = ref<ChainId>(0)

const searchByString = ref('')
const searchModel = ref('')
const isFilterVisible = ref(true)

const isSmallScreen = computed(() => width.value <= WINDOW_BREAKPOINTS.small)
const searchFieldModifications = computed(() =>
  ['dark', 'border-rounded', isSmallScreen.value ? '' : 'icon-large'].join(' '),
)

const loadList = computed(
  () => () =>
    getBooks({
      deployStatus: [BOOK_DEPLOY_STATUSES.successful],
      title: searchByString.value,
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
  books.value = chunk ?? []
}

function concatList(chunk: Book[]) {
  books.value = books.value.concat(chunk ?? [])
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}

const onSearchFocus = () => {
  if (isSmallScreen.value) {
    isFilterVisible.value = false
  }
}

const onSearchBlur = () => {
  isFilterVisible.value = true
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

.bookshelf-page__actions {
  position: relative;
  z-index: var(--z-index-layer-3);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: toRem(20);
  width: 45%;
  height: toRem(52);

  @include respond-to(tablet) {
    width: 70%;
    height: toRem(46);
  }

  @include respond-to(small) {
    width: 100%;
  }
}

.bookshelf-page__actions-search {
  width: clamp(toRem(150), 50%, toRem(285));
  height: toRem(52);

  @include respond-to(tablet) {
    height: toRem(46);
    width: 50%;
  }

  &--full-width {
    width: 100%;
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
