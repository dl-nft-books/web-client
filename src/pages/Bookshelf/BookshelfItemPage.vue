<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  AppButton,
  PurchasingModal,
  PurchasingSuccessModal,
} from '@/common'

import { BookshelfNetworkInfo } from '@/pages/Bookshelf'
import { ErrorHandler } from '@/helpers'
import { ref, watch } from 'vue'
import { formatFiatAssetFromWei } from '@/helpers'
import { BookRecord } from '@/records'
import { useWeb3ProvidersStore } from '@/store'
import { useMetaMaskConnect } from '@/composables'
import { storeToRefs } from 'pinia'
import { getBookById } from '@/api'

const props = defineProps<{
  id: string
}>()
const { provider } = storeToRefs(useWeb3ProvidersStore())
const { connect } = useMetaMaskConnect()
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const isPurchaseModalShown = ref(false)
const isPurchaseSuccessModalShown = ref(false)

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

<template>
  <div class="bookshelf-item">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        :message="$t('bookshelf-item.loading-error-msg')"
      />
      <template v-else-if="book">
        <div class="bookshelf-item__cover-wrp">
          <img
            :src="book.bannerUrl"
            :alt="book.title"
            class="bookshelf-item__cover"
          />
        </div>
        <div class="bookshelf-item__details">
          <h2 class="bookshelf-item__title">
            {{ book.title }}
          </h2>
          <div class="bookshelf-item__actions">
            <div class="bookshelf-item__price">
              {{ formatFiatAssetFromWei(book.price, 'USD') }}
            </div>
            <div class="bookshelf-item__info">
              <p>{{ $t('bookshelf-item.badge-1') }}</p>
              <p>{{ $t('bookshelf-item.badge-2') }}</p>
            </div>
          </div>

          <bookshelf-network-info />
          <app-button
            v-if="provider.isConnected"
            class="bookshelf-item__purchase-btn"
            :text="$t('bookshelf-item.purchase-btn')"
            @click="isPurchaseModalShown = true"
          />

          <app-button
            v-else
            class="bookshelf-item__purchase-btn"
            :text="$t('bookshelf-item.connect-btn')"
            @click="connect"
          />

          <hr class="bookshelf-item__devider" />
          <p class="bookshelf-item__description">
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

<style lang="scss" scoped>
.bookshelf-item {
  $left-column: clamp(#{toRem(200)}, 40%, #{toRem(600)});
  $right-column: clamp(#{toRem(250)}, 55%, #{toRem(700)});

  display: grid;
  width: 100%;
  grid-template-columns: $left-column $right-column;
  grid-column-gap: clamp(#{toRem(10)}, 5%, #{toRem(80)});
  padding-top: toRem(40);
  padding-bottom: toRem(100);
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

.bookshelf-item__cover-wrp {
  max-width: 100%;
}

.bookshelf-item__cover {
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

.bookshelf-item__details {
  display: flex;
  flex-direction: column;
}

.bookshelf-item__title {
  text-transform: uppercase;
  font-size: toRem(48);
  line-height: 1.2;
  font-weight: 900;
  margin-bottom: toRem(40);

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(30);
  }
}

.bookshelf-item__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(20);
  padding-bottom: toRem(36);
  margin-bottom: toRem(20);

  @include respond-to(small) {
    flex-direction: column;
  }
}

.bookshelf-item__info {
  display: flex;
  flex-direction: column;
  text-align: right;
  user-select: none;
  gap: toRem(5);

  & > * {
    font-style: italic;
    letter-spacing: toRem(1);
    font-weight: 400;
    font-size: toRem(20);
    line-height: 120%;
    color: var(--text-secondary-main);
  }
}

.bookshelf-item__price {
  font-weight: 700;
  font-size: toRem(44);
  line-height: toRem(54);
  color: var(--primary-main);

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(30);
  }
}

.bookshelf-item__purchase-btn {
  width: 100%;
  font-size: toRem(22);
}

.bookshelf-item__devider {
  width: 100%;
  height: toRem(1);
  margin-top: toRem(45);
  border: none;
  background-color: var(--border-secondary-main);
}

.bookshelf-item__description {
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
