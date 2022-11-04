<script lang="ts" setup>
import { Loader, ErrorMessage, NoDataMessage, BookCard } from '@/common'

import { ErrorHandler, getBooks } from '@/helpers'
import { BookRecord } from '@/records'
import { ref } from 'vue'

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const books = ref<BookRecord[]>([])

const init = async () => {
  try {
    const booksResponse = await getBooks()
    books.value = booksResponse.map(book => new BookRecord(book))
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}
init()
</script>

<template>
  <div class="bookshelf-page">
    <h2 class="bookshelf-page__title">
      {{ $t('bookshelf-page.title') }}
    </h2>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('bookshelf-page.loading-error-msg')" />
      </template>
      <template v-else-if="books.length">
        <div class="bookshelf-page__list">
          <book-card
            class="bookshelf-page__card"
            v-for="book in books"
            :key="book.id"
            :book="book"
          />
        </div>
      </template>
      <template v-else>
        <no-data-message :message="$t('bookshelf-page.no-data-msg')" />
      </template>
    </template>
    <template v-else>
      <loader />
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
  grid-template-columns: repeat(auto-fit, minmax(toRem(270), 1fr));
  grid-gap: toRem(20);
}
</style>
