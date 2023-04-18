<template>
  <div class="my-nft-item-page">
    <template v-if="isLoaded">
      <error-message
        v-if="errorMsg"
        class="my-nft-item-page__error"
        :message="$t('my-nft-item-page.loading-error-msg')"
      />

      <template v-else-if="nftToken">
        <div class="my-nft-item-page__cover-wrp">
          <img
            :src="nftToken.metadata.image"
            :alt="nftToken.metadata.name"
            class="my-nft-item-page__cover"
          />
        </div>
        <div class="my-nft-item-page__details">
          <h2 class="my-nft-item-page__title">
            {{ nftToken.metadata.name }}
          </h2>
          <tabs
            v-model="currentTab"
            :tabs="Object.values(TABS)"
            class="my-nft-item-page__tabs"
          />
          <transition name="tabs">
            <nft-description
              v-if="currentTab === TABS.bookDescription.id"
              :description="nftToken.metadata.description"
            />
          </transition>
          <transition name="tabs">
            <nft-details
              v-if="currentTab === TABS.myPurchase.id"
              :nft-token="nftToken"
            />
          </transition>
        </div>
      </template>
    </template>
    <loader v-else class="my-nft-item-page__loader" />
    <img class="my-nfts-item-page__background" src="/images/fancy-lines.png" />
  </div>
</template>

<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  Tabs,
  NftDetails,
  NftDescription,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { ref, computed } from 'vue'
import { useNftTokens, TokenFullInfo, useErc721 } from '@/composables'
import { useI18n } from 'vue-i18n'
import { useWeb3ProvidersStore } from '@/store'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'

const { t } = useI18n()
const { getNft } = useNftTokens()
const { init: initErc721, getOwner } = useErc721()

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const TABS = {
  myPurchase: {
    translation: t('my-nft-item-page.my-purchase-tab'),
    id: 'my-purchase-tab',
  },
  bookDescription: {
    translation: t('my-nft-item-page.book-description-tab'),
    id: 'book-description-tab',
  },
}

const props = defineProps<{
  id: string
  contract: string
}>()

const isLoaded = ref(false)
const errorMsg = ref('')
const currentTab = ref(TABS.myPurchase.id)

const nftToken = ref<TokenFullInfo | undefined>()

const init = async () => {
  try {
    const data = await getNft(props.contract, props.id)
    initErc721(data.tokenContract)

    const owner = await getOwner(data.tokenId)

    // not showing this page if its not owner of nft
    if (provider.value.selectedAddress !== owner) {
      router.push({ name: ROUTE_NAMES.myNfts })
      return
    }

    nftToken.value = data
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    if (error instanceof Error) errorMsg.value = error.message
  }
  isLoaded.value = true
}

init()
</script>

<style lang="scss" scoped>
.my-nft-item-page {
  $left-column: clamp(#{toRem(200)}, 40%, #{toRem(600)});
  $right-column: clamp(#{toRem(250)}, 55%, #{toRem(700)});

  display: grid;
  width: 100%;
  flex: 1;
  grid-template-columns: $left-column $right-column;
  grid-column-gap: clamp(#{toRem(10)}, 5%, #{toRem(80)});
  padding-top: toRem(40);
  padding-bottom: toRem(100);
  justify-content: center;
  background-color: var(--background-primary-dark);
  position: relative;
  z-index: var(--z-index-layer-1);

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    row-gap: toRem(40);
  }

  @include respond-to(small) {
    max-width: 100%;
  }
}

.my-nft-item-page__error,
.my-nft-item-page__loader {
  grid-column: span 2;
}

.my-nft-item-page__cover-wrp {
  width: 100%;
}

.my-nft-item-page__cover {
  width: 100%;
  height: auto;
  border-radius: toRem(8);
  filter: var(--cover-image-shadow);

  @include respond-to(medium) {
    display: block;
    width: auto;
    max-height: toRem(500);
    max-width: 100%;
    margin: 0 auto;
  }
}

.my-nft-item-page__details {
  display: flex;
  flex-direction: column;
}

.my-nft-item-page__title {
  text-transform: uppercase;
  margin-bottom: toRem(60);
  word-wrap: break-word;

  @include respond-to(medium) {
    text-align: center;
  }
}

.my-nft-item-page__tabs {
  margin-bottom: toRem(40);
}

.tabs-enter-active,
.tabs-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.tabs-enter-from,
.tabs-leave-to {
  opacity: 0;
  transform: translateX(toRem(-50));
}

.my-nfts-item-page__background {
  @include background-image;
}
</style>
