<template>
  <div class="bookshelf-item-page">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        :message="$t('bookshelf-item-page.loading-error-msg')"
      />
      <template v-else-if="book">
        <div class="bookshelf-item-page__cover-wrp">
          <img
            :src="book.bannerUrl"
            :alt="book.title"
            class="bookshelf-item-page__cover"
          />
        </div>
        <div class="bookshelf-item-page__details">
          <h2 class="bookshelf-item-page__title">
            {{ book.title }}
          </h2>
          <div class="bookshelf-item-page__actions">
            <div class="bookshelf-item-page__price">
              {{ formatFiatAssetFromWei(book.price, CURRENCY.USD) }}
            </div>
            <div class="bookshelf-item-page__info">
              <app-button
                v-if="book.voucherToken !== ethers.constants.AddressZero"
                :icon-right="$icons.voucher"
                scheme="default"
                icon-size="large"
                :href="getEtherscanLink(book.voucherToken)"
              />
            </div>
          </div>
          <bookshelf-network-info
            v-if="bookNetwork"
            :name="bookNetwork.name"
            :scheme="getNetworkScheme(bookNetwork.chain_id.toString())"
          />
          <app-button
            v-if="provider.isConnected"
            class="bookshelf-item-page__purchase-btn"
            :text="$t('bookshelf-item-page.purchase-btn')"
            @click="isPurchaseModalShown = true"
          />

          <app-button
            v-else
            class="bookshelf-item-page__purchase-btn"
            :text="$t('bookshelf-item-page.connect-btn')"
            @click="connect"
          />

          <hr class="bookshelf-item-page__devider" />
          <p class="bookshelf-item-page__description">
            {{ book.description }}
          </p>
        </div>

        <purchasing-modal
          v-if="book"
          v-model:is-shown="isPurchaseModalShown"
          :book="book"
          @submit="submit"
        />

        <purchasing-success-modal
          v-model:is-shown="isPurchaseSuccessModalShown"
        />
      </template>
    </template>
    <loader v-else />
  </div>
</template>

<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  AppButton,
  PurchasingModal,
  PurchasingSuccessModal,
} from '@/common'

import { BookshelfNetworkInfo } from '@/pages/Bookshelf'
import { ref, watch, computed } from 'vue'
import {
  formatFiatAssetFromWei,
  ErrorHandler,
  getNetworkScheme,
} from '@/helpers'
import { CURRENCY } from '@/enums'
import { BookRecord } from '@/records'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { useMetaMaskConnect } from '@/composables'
import { storeToRefs } from 'pinia'
import { getBookById } from '@/api'
import { ethers } from 'ethers'

const props = defineProps<{
  id: string
}>()
const { provider } = storeToRefs(useWeb3ProvidersStore())
const { connect } = useMetaMaskConnect()

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const isPurchaseModalShown = ref(false)
const isPurchaseSuccessModalShown = ref(false)

const networkStore = useNetworksStore()
const bookNetwork = computed(() =>
  networkStore.getNetworkByID(book.value?.chainID),
)

const book = ref<BookRecord | undefined>()

const submit = async () => {
  try {
    isPurchaseModalShown.value = false
    isPurchaseSuccessModalShown.value = true
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const init = async () => {
  try {
    const { data } = await getBookById(props.id)
    book.value = new BookRecord(data)
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

// TODO dynamic link
const getEtherscanLink = (token: string) => {
  return `https://goerli.etherscan.io/token/${token}`
}

watch(
  () => provider.value.isConnected,
  value => {
    if (!value) {
      isPurchaseModalShown.value = false
    }
  },
)

init()
</script>

<style lang="scss" scoped>
.bookshelf-item-page {
  $left-column: clamp(#{toRem(200)}, 40%, #{toRem(600)});
  $right-column: clamp(#{toRem(250)}, 55%, #{toRem(700)});

  display: grid;
  width: 100%;
  grid-template-columns: $left-column $right-column;
  grid-column-gap: clamp(#{toRem(10)}, 5%, #{toRem(80)});
  padding-top: toRem(40);
  padding-bottom: toRem(150);
  justify-content: center;
  background: url('/images/background-cubes.png') no-repeat left bottom /
    contain;

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    row-gap: toRem(40);
  }

  @include respond-to(small) {
    max-width: 100%;
  }
}

.bookshelf-item-page__cover-wrp {
  max-width: 100%;
}

.bookshelf-item-page__cover {
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

.bookshelf-item-page__details {
  display: flex;
  flex-direction: column;
}

.bookshelf-item-page__title {
  text-transform: uppercase;
  font-size: toRem(48);
  line-height: 1.2;
  font-weight: 900;
  margin-bottom: toRem(40);
  max-width: 100%;

  @include text-ellipsis;

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(30);
  }
}

.bookshelf-item-page__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(20);
  padding-bottom: toRem(36);
  margin-bottom: toRem(20);

  @include respond-to(medium) {
    justify-content: center;
  }
}

.bookshelf-item-page__info {
  display: flex;
  flex-direction: column;
  text-align: right;
  user-select: none;
  gap: toRem(5);
}

.bookshelf-item-page__price {
  font-weight: 700;
  font-size: toRem(44);
  line-height: toRem(54);
  color: var(--primary-main);

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(30);
  }
}

.bookshelf-item-page__purchase-btn {
  width: 100%;
  font-size: toRem(22);
}

.bookshelf-item-page__devider {
  width: 100%;
  height: toRem(1);
  margin-top: toRem(45);
  border: none;
  background-color: var(--border-secondary-main);
}

.bookshelf-item-page__description {
  font-size: toRem(24);
  line-height: 1.2;
  font-weight: 400;
  color: var(--text-secondary-main);
  margin-top: toRem(10);

  @include respond-to(medium) {
    font-size: toRem(18);
  }
}
</style>
