<template>
  <div class="my-nfts-page">
    <h3 class="my-nfts-page__title">
      {{ $t('my-nfts-page.title') }}
    </h3>
    <loader v-if="isLoading" />
    <nft-list
      v-else-if="provider.isConnected && totalAmount !== -1"
      :total-amount="totalAmount"
    />

    <my-nfts-no-data v-else is-not-connected />
    <img class="my-nfts-page__background" src="/images/fancy-lines.png" />
  </div>
</template>

<script lang="ts" setup>
import { Loader } from '@/common'
import { MyNftsNoData, NftList } from '@/pages/my-nfts'
import { computed, ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { useBooks } from '@/composables'
import { ErrorHandler } from '@/helpers'

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

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
.my-nfts-page {
  display: flex;
  flex-direction: column;
  padding-top: toRem(70);
  padding-bottom: toRem(200);
  overflow: hidden;
  flex: 1;
  position: relative;
  background-color: var(--background-primary-dark);
  z-index: var(--z-index-layer-2);

  @include respond-to(tablet) {
    padding-top: toRem(10);
    padding-bottom: toRem(80);
  }
}

.my-nfts-page__title {
  color: var(--text-primary-invert-main);
  margin-bottom: toRem(18);
}

.my-nfts-page__background {
  @include background-image;
}
</style>
