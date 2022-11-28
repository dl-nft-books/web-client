<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  NoDataMessage,
  BookCard,
  AppButton,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { BookRecord } from '@/records'
import { ref } from 'vue'
import { BOOK_DEPLOY_STATUSES } from '@/enums'
import { getBooks } from '@/api'
import { usePaginate } from '@/composables'
import { Book } from '@/types'

const isLoadFailed = ref(false)
const books = ref<BookRecord[]>([])

const { loadFirstPage, loadNextPage, isLoading, isCollectionFetched } =
  usePaginate(loadList, setList, concatList, onError, 1)

function loadList() {
  return getBooks({
    deployStatus: [BOOK_DEPLOY_STATUSES.successful],
    pageLimit: 1,
  })
}

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

loadFirstPage()
</script>

<template>
  <div class="bookshelf-page">
    <h2 class="bookshelf-page__title">
      {{ $t('bookshelf-page.title') }}
    </h2>
    <template v-if="isLoadFailed">
      <error-message :message="$t('bookshelf-page.loading-error-msg')" />
    </template>
    <template v-else-if="books.length || isLoading">
      <template v-if="books.length">
        <div class="bookshelf-page__list">
          <book-card
            class="bookshelf-page__card"
            v-for="book in books"
            :key="book.id"
            :book="book"
          />
        </div>
      </template>
      <template v-if="isLoading">
        <loader />
      </template>

      <app-button
        v-if="!isCollectionFetched"
        :text="$t('bookshelf-page.load-more-btn')"
        size="small"
        @click="loadNextPage"
      />
    </template>
    <template v-else>
      <no-data-message :message="$t('bookshelf-page.no-data-msg')" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bookshelf-page {
  display: flex;
  flex-direction: column;
  gap: toRem(34);
  padding-top: toRem(70);
  padding-bottom: toRem(200);
  background: url('/images/background-cubes.png') no-repeat right top / contain;
}

.bookshelf-page__title {
  text-transform: uppercase;
  font-size: toRem(40);
  line-height: 1.2;
  font-weight: 700;
}

.bookshelf-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(toRem(292), 1fr));
  grid-gap: toRem(20);
}
</style>
