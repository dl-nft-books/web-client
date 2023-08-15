<template>
  <section class="book-list">
    <error-message
      v-if="isLoadFailed"
      :message="$t('bookshelf-page.loading-error-msg')"
    />
    <template v-else-if="books.length || isLoading">
      <div v-if="books.length" class="book-list__books">
        <book-card v-for="book in books" :key="book.id" :book="book" />
      </div>

      <div class="bookshelf-page__loader">
        <loader v-if="isLoading" />
      </div>

      <app-button
        v-if="isLoadMoreBtnShown"
        class="book-list__load-more-btn"
        size="small"
        scheme="flat"
        color="primary"
        :text="$t('bookshelf-page.load-more-btn')"
        @click="loadNextPage"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { Loader, ErrorMessage, BookCard, AppButton } from '@/common'

import { ErrorHandler } from '@/helpers'
import { useBooks, useContractPagination } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { BaseBookInfo } from '@/types'
import { DateUtil } from '@distributedlab/utils'

const props = defineProps<{
  totalAmount: number
}>()

const webProvidersStore = useWeb3ProvidersStore()

const provider = computed(() => webProvidersStore.provider)

const { getBooksFromContract } = useBooks()

const isLoadFailed = ref(false)
const books = ref<BaseBookInfo[]>([])

const loadList = computed(
  () => (limit: number, offset: number) =>
    getBooksFromContract(limit, offset, provider.value.chainId),
)
const { loadNextPage, isLoading, isLoadMoreBtnShown } = useContractPagination(
  loadList,
  setList,
  concatList,
  onError,
  {
    isReverted: true,
    totalAmount: props.totalAmount,
  },
)

// filtering disabled books and sorting to show user the newest books first
const processBookList = (bookList: BaseBookInfo[]) => {
  return bookList
    .filter(book => !book.isDisabled)
    .sort((oneBook, anotherBook) =>
      DateUtil.isBefore(oneBook.created_at, anotherBook.created_at) ? 1 : -1,
    )
}

function setList(chunk: BaseBookInfo[]) {
  books.value = chunk.length ? processBookList(chunk) : []
}

function concatList(chunk: BaseBookInfo[]) {
  books.value = processBookList(books.value.concat(chunk.length ? chunk : []))
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}
</script>

<style lang="scss" scoped>
.book-list {
  display: flex;
  flex-direction: column;
  gap: toRem(34);
}

.book-list__books {
  display: grid;
  grid-template-columns: repeat(auto-fill, toRem(292));
  grid-gap: toRem(20);
  justify-content: space-evenly;
}

.book-list__load-more-btn {
  margin: toRem(20) auto 0;
  width: toRem(240);
  color: var(--white);
  border: toRem(2) solid var(--white);

  --app-button-flat-text-hover: var(--primary-light);
  --app-button-flat-border: #{toRem(2)} solid var(--primary-light);
}
</style>
