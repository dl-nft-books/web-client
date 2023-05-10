<template>
  <div class="bookshelf-page">
    <bookshelf-header />
    <h1 class="bookshelf-page__title">
      {{ $t('bookshelf-page.title') }}
    </h1>

    <loader v-if="isLoading" />
    <book-list v-else-if="totalAmount !== -1" :total-amount="totalAmount" />
    <no-data-message v-else :message="$t('bookshelf-page.no-data-msg')" />
    <img
      class="bookshelf-page__background bookshelf-page__background--bottom"
      src="/images/fancy-lines.png"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

import { Loader, NoDataMessage } from '@/common'
import { useBooks } from '@/composables'
import { BookshelfHeader, BookList } from '@/pages/bookshelf'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'

const webProvidersStore = useWeb3ProvidersStore()

const provider = computed(() => webProvidersStore.provider)

const totalAmount = ref(-1)
const isLoading = ref(false)

const { getTotalBooksAmount } = useBooks()

const init = async () => {
  isLoading.value = true
  totalAmount.value = -1

  try {
    const data = await getTotalBooksAmount(provider.value.chainId)
    if (!data) throw new Error('No books found')

    totalAmount.value = Number(data)
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }

  isLoading.value = false
}

watch(() => provider.value.chainId, init, { immediate: true })
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
}

.bookshelf-page__title {
  text-transform: uppercase;

  @include respond-to(tablet) {
    text-align: center;
    font-size: toRem(26);
  }
}

.bookshelf-page__background {
  @include background-image;
}
</style>
