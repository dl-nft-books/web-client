<template>
  <div class="bookshelf-page">
    <bookshelf-header />
    <h1 class="bookshelf-page__title">
      {{ $t('bookshelf-page.title') }}
    </h1>

    <book-list v-if="totalAmount !== -1" :total-amount="totalAmount" />
    <loader v-else />
    <img
      class="bookshelf-page__background bookshelf-page__background--bottom"
      src="/images/fancy-lines.png"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

import { Loader } from '@/common'
import { useBooks } from '@/composables'
import { BookshelfHeader, BookList } from '@/pages/bookshelf'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@/config'

const webProvidersStore = useWeb3ProvidersStore()

const provider = computed(() => webProvidersStore.provider)

const totalAmount = ref(-1)

const { getTotalBooksAmount } = useBooks()

onMounted(async () => {
  const data = await getTotalBooksAmount(
    provider.value.isConnected
      ? provider.value.chainId
      : config.DEFAULT_CHAIN_ID,
  )

  if (!data) return

  totalAmount.value = Number(data)
})
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
