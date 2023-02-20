<template>
  <div class="my-nfts-page">
    <h3>
      {{ $t('my-nfts-page.title') }}
    </h3>
    <template v-if="provider.isConnected">
      <error-message
        v-if="isLoadFailed"
        :message="$t('my-nfts-page.loading-error-msg')"
      />
      <template v-else-if="nftList.length || isLoading">
        <div v-if="nftList.length" class="my-nfts-page__list">
          <book-card
            v-for="book in nftList"
            :key="book.id"
            background-color="tertiary"
            :book="book"
            :action-btn-text="$t('my-nfts-page.details-btn')"
          />
        </div>

        <loader v-if="isLoading" />

        <app-button
          v-if="isLoadMoreBtnShown"
          class="my-nfts-page__load-more-btn"
          size="small"
          scheme="flat"
          :text="$t('my-nfts-page.load-more-btn')"
          @click="loadNextPage"
        />
      </template>

      <my-nfts-no-data v-else />
    </template>

    <my-nfts-no-data v-else is-not-connected />
  </div>
</template>

<script lang="ts" setup>
import { Loader, ErrorMessage, BookCard, AppButton } from '@/common'
import { MyNftsNoData } from '@/pages/my-nfts'

import { ErrorHandler } from '@/helpers'
import { ref, watch, computed } from 'vue'
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

const loadList = computed(
  () => () =>
    getGeneratedTokens({
      account: [provider.value.selectedAddress!],
      status: [GENERATED_NFT_STATUSES.finishedUploading],
    }),
)

const { loadFirstPage, loadNextPage, isLoading, isLoadMoreBtnShown } =
  usePaginate(loadList, setList, concatList, onError, {
    isLoadOnMounted: false,
  })

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

<style lang="scss" scoped>
.my-nfts-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: toRem(34);
  padding-top: toRem(70);
  padding-bottom: toRem(200);
  background: url('/images/background-cubes.png') no-repeat right center /
    contain;
  background-size: clamp(toRem(300), 30%, toRem(500));

  @include respond-to(tablet) {
    padding-top: toRem(10);
    padding-bottom: toRem(80);
  }
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
