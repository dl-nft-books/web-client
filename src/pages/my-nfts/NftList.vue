<template>
  <div>
    <error-message
      v-if="isLoadFailed"
      :message="$t('my-nfts-page.loading-error-msg')"
    />
    <template v-else-if="nftList.length || isLoading">
      <div v-if="nftList.length" class="nft-list__items">
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
        class="nft-list__load-more-btn"
        size="small"
        scheme="flat"
        :text="$t('my-nfts-page.load-more-btn')"
        @click="loadNextPage"
      />
    </template>
    <my-nfts-no-data v-else />
  </div>
</template>

<script setup lang="ts">
import { Loader, ErrorMessage, BookCard, AppButton } from '@/common'
import { MyNftsNoData } from '@/pages/my-nfts'
import { ErrorHandler } from '@/helpers'
import { ref, computed, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import {
  useContractPagination,
  useNftTokens,
  TokenBaseInfo,
} from '@/composables'

const props = defineProps<{
  totalAmount: number
}>()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const isLoadFailed = ref(false)
const nftList = ref<TokenBaseInfo[]>([])

const { getNftList } = useNftTokens()

const loadList = computed(
  () => (limit: number, offset: number) =>
    getNftList(provider.value.selectedAddress, limit, offset),
)

const { loadNextPage, isLoading, isLoadMoreBtnShown, loadFirstPage } =
  useContractPagination(loadList, setList, concatList, onError, {
    isReverted: true,
    totalAmount: props.totalAmount,
  })

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

watch(
  () => provider.value.chainId,
  () => {
    isLoadFailed.value = false
    loadFirstPage()
  },
)
</script>

<style lang="scss" scoped>
.nft-list__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, toRem(292));
  grid-gap: toRem(20);
  justify-content: space-evenly;
}

.nft-list__load-more-btn {
  margin: toRem(40) auto 0;
}
</style>
