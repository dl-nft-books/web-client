<script lang="ts" setup>
import { Loader, ErrorMessage, BookCard, AppButton } from '@/common'
import MyNftsNoData from '@/pages/my-nfts/MyNftsNoData.vue'

import { ErrorHandler } from '@/helpers'
import { ref, watch } from 'vue'
import { GeneratedNFtRecord } from '@/records'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { GENERATED_NFT_STATUSES } from '@/enums'
import { getGeneratedTokens } from '@/api'
import { usePaginate } from '@/composables'
import { Token } from '@/types'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const isLoadFailed = ref(false)
const nftList = ref<GeneratedNFtRecord[]>([])

const { loadFirstPage, loadNextPage, isLoading, isLoadMoreBtnShown } =
  usePaginate(loadList, setList, concatList, onError, {
    isLoadOnMounted: false,
  })

function loadList() {
  return getGeneratedTokens({
    account: [provider.value.selectedAddress!],
    status: [GENERATED_NFT_STATUSES.finishedUploading],
  })
}

function setList(chunk: Token[]) {
  nftList.value = chunk.map(item => new GeneratedNFtRecord(item)) ?? []
}

function concatList(chunk: Token[]) {
  nftList.value = nftList.value.concat(
    chunk.map(item => new GeneratedNFtRecord(item)) ?? [],
  )
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}

watch(
  () => provider.value.selectedAddress,
  val => {
    if (val) {
      loadFirstPage()
    } else {
      nftList.value = []
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="my-nfts-page">
    <h2 class="my-nfts-page__title">
      {{ $t('my-nfts-page.title') }}
    </h2>
    <template v-if="provider.isConnected">
      <template v-if="isLoadFailed">
        <error-message :message="$t('my-nfts-page.loading-error-msg')" />
      </template>
      <template v-else-if="nftList.length || isLoading">
        <template v-if="nftList.length">
          <div class="my-nfts-page__list">
            <book-card
              class="my-nfts-page__card"
              v-for="book in nftList"
              :key="book.id"
              background-color="tertiary"
              :book="book"
              scheme="link"
              :action-btn-text="$t('my-nfts-page.details-btn')"
              is-user-owned
            />
          </div>
        </template>
        <template v-if="isLoading">
          <loader />
        </template>

        <app-button
          v-if="isLoadMoreBtnShown"
          class="my-nfts-page__load-more-btn"
          size="small"
          scheme="flat"
          :text="$t('my-nfts-page.load-more-btn')"
          @click="loadNextPage"
        />
      </template>
      <template v-else>
        <my-nfts-no-data />
      </template>
    </template>
    <template v-else>
      <my-nfts-no-data is-no-connected />
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
  min-height: vh(80);
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

.my-nfts-page__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
