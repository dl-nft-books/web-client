<script lang="ts" setup>
import { Loader, ErrorMessage, BookCard } from '@/common'
import MyNftsNoData from '@/pages/my-nfts/MyNftsNoData.vue'

import { ErrorHandler, getGeneratedTokens } from '@/helpers'
import { ref, watch } from 'vue'
import { GeneratedNFtRecord } from '@/records'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { GENERATED_NFT_STATUSES } from '@/enums'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const nftList = ref<GeneratedNFtRecord[]>([])

const init = async () => {
  isLoaded.value = false
  try {
    if (provider.value.selectedAddress) {
      const data = await getGeneratedTokens({
        account: [provider.value.selectedAddress],
        status: [GENERATED_NFT_STATUSES.finishedUploading],
      })
      nftList.value = data.map(book => new GeneratedNFtRecord(book))
    } else {
      nftList.value = []
    }
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

watch(() => provider.value.selectedAddress, init, { immediate: true })
</script>

<template>
  <div class="my-nfts-page">
    <h2 class="my-nfts-page__title">
      {{ $t('my-nfts-page.title') }}
    </h2>
    <template v-if="!provider.isConnected">
      <my-nfts-no-data is-no-connected />
    </template>
    <template v-else>
      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <error-message :message="$t('my-nfts-page.loading-error-msg')" />
        </template>
        <template v-else-if="nftList.length">
          <div class="my-nfts-page__list">
            <book-card
              class="my-nfts-page__card"
              v-for="book in nftList"
              :key="book.id"
              :book="book"
              scheme="link"
              :action-btn-text="$t('my-nfts-page.details-btn')"
              is-user-owned
            />
          </div>
        </template>
        <template v-else>
          <my-nfts-no-data />
        </template>
      </template>
      <template v-else>
        <loader />
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.my-nfts-page {
  display: flex;
  flex-direction: column;
  gap: toRem(34);
  padding-top: toRem(70);
  padding-bottom: toRem(200);
  background: url('/images/background-cubes.png') no-repeat right / contain;
}

.my-nfts-page__title {
  text-transform: uppercase;
  font-size: toRem(40);
  line-height: 1.2;
  font-weight: 700;
}

.my-nfts-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(toRem(292), 1fr));
  grid-gap: toRem(20);
}
</style>
