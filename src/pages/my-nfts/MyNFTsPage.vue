<template>
  <div class="my-nfts-page">
    <h3 class="my-nfts-page__title">
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
            :key="`${book.tokenContract}${book.tokenId}`"
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
    <img class="my-nfts-page__background" src="/images/fancy-lines.png" />
  </div>
</template>

<script lang="ts" setup>
import { Loader, ErrorMessage, BookCard, AppButton } from '@/common'
import { MyNftsNoData } from '@/pages/my-nfts'
import { ErrorHandler } from '@/helpers'
import { ref, computed } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import {
  useContractPagination,
  useNftTokens,
  TokenBaseInfo,
} from '@/composables'
const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const isLoadFailed = ref(false)
const nftList = ref<TokenBaseInfo[]>([])

const { getNftList } = useNftTokens()

const loadList = computed(
  () => (limit: number, offset: number) =>
    getNftList(provider.value.selectedAddress, limit, offset),
)

const { loadNextPage, isLoading, isLoadMoreBtnShown } = useContractPagination(
  loadList,
  setList,
  concatList,
  onError,
)

function setList(chunk: TokenBaseInfo[]) {
  nftList.value = chunk ?? []
}

function concatList(chunk: TokenBaseInfo[]) {
  nftList.value = nftList.value.concat(chunk ?? [])
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}
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

  // @include gray-background-curve;

  @include respond-to(tablet) {
    padding-top: toRem(10);
    padding-bottom: toRem(80);
  }
}

.my-nfts-page__title {
  color: var(--text-primary-invert-main);
  margin-bottom: toRem(18);
}

.my-nfts-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, toRem(292));
  grid-gap: toRem(20);
  justify-content: space-evenly;
}

.my-nfts-page__load-more-btn {
  margin: toRem(40) auto 0;
}

.my-nfts-page__background {
  @include background-image;
}
</style>
