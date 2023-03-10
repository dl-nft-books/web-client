<template>
  <div class="my-nft-item-page">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        class="my-nft-item-page__error"
        :message="$t('my-nft-item-page.loading-error-msg')"
      />

      <template v-else-if="nftToken">
        <div class="my-nft-item-page__cover-wrp">
          <img
            :src="nftToken.image_url"
            :alt="nftToken.name"
            class="my-nft-item-page__cover"
          />
        </div>
        <div class="my-nft-item-page__details">
          <h2 class="my-nft-item-page__title">
            {{ nftToken.name }}
          </h2>
          <tabs
            v-model="currentTab"
            :tabs="Object.values(TABS)"
            class="my-nft-item-page__tabs"
          />
          <nft-description
            v-if="currentTab === TABS.bookDescription.id"
            :description="nftToken.description"
          />
          <nft-details
            v-if="currentTab === TABS.myPurchase.id"
            :nft-token="nftToken"
          />
        </div>
      </template>
    </template>
    <loader v-else class="my-nft-item-page__loader" />
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
import { ref } from 'vue'
import { useGenerator } from '@/composables'
import { Token } from '@/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { getGeneratedTokenById } = useGenerator()

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
}>()

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const currentTab = ref(TABS.myPurchase.id)

const nftToken = ref<Token | undefined>()

const init = async () => {
  try {
    const data = await getGeneratedTokenById(props.id)
    nftToken.value = data
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
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
  background: url('/images/background-cubes.png') no-repeat right center /
    contain;
  background-size: clamp(toRem(300), 30%, toRem(400));

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    row-gap: toRem(40);
    background: url('/images/background-cubes.png') no-repeat right top /
      contain;
    background-size: clamp(toRem(300), 50%, toRem(500));
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
</style>
