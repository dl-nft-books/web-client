<script lang="ts" setup>
import { Loader, ErrorMessage, NoDataMessage, BookCard } from '@/common'

import { ErrorHandler } from '@/helpers'
import { Book } from '@/types'
import { ref } from 'vue'

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const books = ref<Book[]>([])

const init = async () => {
  try {
    await loadBooks()
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const loadBooks = async () => {
  books.value = [
    {
      id: '1',
      title: 'Blockchain and decentralized systems, Volume 1',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      coverUrl:
        'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80',
    },
    {
      id: '2',
      title: 'Blockchain and decentralized systems, Volume 1',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      coverUrl:
        'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80',
    },
    {
      id: '3',
      title: 'Blockchain and decentralized systems, Volume 1',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      coverUrl:
        'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80',
    },
    {
      id: '4',
      title: 'Blockchain and decentralized systems, Volume 1',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      coverUrl:
        'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80',
    },
  ]
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
  grid-template-columns: repeat(auto-fit, minmax(toRem(292), 1fr));
  grid-gap: toRem(20);
}
</style>
