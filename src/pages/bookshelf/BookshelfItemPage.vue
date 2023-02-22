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
            :src="book.banner.attributes.url"
            :alt="book.title"
            class="bookshelf-item-page__cover"
          />
        </div>
        <div class="bookshelf-item-page__details">
          <h2 class="bookshelf-item-page__title">
            {{ book.title }}
          </h2>
          <marquee
            :text="[
              $t('bookshelf-item-page.badge-1'),
              $t('bookshelf-item-page.badge-2'),
            ]"
          />

          <section class="bookshelf-item-page__prices">
            <bookshelf-prices
              :price="formatFiatAssetFromWei(book.price, CURRENCIES.USD)"
              :floor-price="
                formatFiatAssetFromWei(book.floor_price, CURRENCIES.USD)
              "
              :voucher-link="
                book.voucher_token !== ethers.constants.AddressZero
                  ? getBlockExplorerLink(book.chain_id, book.voucher_token)
                  : undefined
              "
            />
          </section>

          <bookshelf-network-info
            v-if="bookNetwork"
            :name="bookNetwork.name"
            :scheme="getNetworkScheme(bookNetwork.chain_id.toString())"
          />
          <app-button
            v-if="provider.isConnected"
            class="bookshelf-item-page__purchase-btn"
            size="small"
            :text="$t('bookshelf-item-page.purchase-btn')"
            @click="isPurchaseModalShown = true"
          />

          <app-button
            v-else
            class="bookshelf-item-page__purchase-btn"
            size="small"
            :text="$t('bookshelf-item-page.connect-btn')"
            @click="provider.connect"
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
    <loader v-else class="bookshelf-item-page__loader" />
  </div>
</template>

<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  AppButton,
  PurchasingModal,
  PurchasingSuccessModal,
  Marquee,
} from '@/common'

import { BookshelfNetworkInfo, BookshelfPrices } from '@/pages/bookshelf'
import { ref, watch, computed } from 'vue'
import {
  formatFiatAssetFromWei,
  ErrorHandler,
  getNetworkScheme,
  getBlockExplorerLink,
} from '@/helpers'
import { CURRENCIES } from '@/enums'
import { useBooks } from '@/composables'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ethers } from 'ethers'
import { Book } from '@/types'

const props = defineProps<{
  id: string
}>()
const { provider } = storeToRefs(useWeb3ProvidersStore())

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const isPurchaseModalShown = ref(false)
const isPurchaseSuccessModalShown = ref(false)

const networkStore = useNetworksStore()
const { getBookById } = useBooks()
const bookNetwork = computed(() =>
  networkStore.getNetworkByID(book.value?.chain_id),
)

const book = ref<Book | undefined>()

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
    const data = await getBookById(props.id)

    book.value = data
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
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
  flex: 1;
  width: 100%;
  grid-template-columns: $left-column $right-column;
  grid-column-gap: clamp(#{toRem(10)}, 5%, #{toRem(80)});
  padding-top: toRem(40);
  padding-bottom: toRem(150);
  justify-content: center;
  background: url('/images/background-cubes.png') no-repeat right center /
    contain;
  background-size: clamp(toRem(300), 30%, toRem(500));

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

.bookshelf-item-page__loader {
  grid-column: span 2;
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
  margin-bottom: toRem(34);
  max-width: 100%;
  word-wrap: break-word;

  @include respond-to(medium) {
    text-align: center;
  }
}

.bookshelf-item-page__prices {
  width: 70%;
  margin: toRem(49) 0;

  @include respond-to(tablet) {
    width: 90%;
    margin: toRem(49) 0 toRem(30) 0;
  }
}

.bookshelf-item-page__info {
  display: flex;
  flex-direction: column;
  text-align: right;
  user-select: none;
  gap: toRem(5);
}

.bookshelf-item-page__purchase-btn {
  text-transform: uppercase;
  width: 100%;
  height: toRem(60);
  font-size: toRem(22);
  line-height: 120%;
}

.bookshelf-item-page__devider {
  width: 100%;
  height: toRem(1);
  margin-top: toRem(45);
  border: none;
  background-color: var(--border-secondary-main);
}

.bookshelf-item-page__description {
  color: var(--text-secondary-main);
  margin-top: toRem(10);
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: toRem(24);

  @include respond-to(medium) {
    font-size: toRem(18);
  }
}
</style>
