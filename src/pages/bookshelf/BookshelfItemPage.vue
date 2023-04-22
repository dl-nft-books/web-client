<template>
  <div class="bookshelf-item-page">
    <template v-if="isLoaded">
      <template v-if="book">
        <div class="bookshelf-item-page__cover-wrp">
          <img
            :src="book.banner.attributes.url"
            :alt="book.tokenName"
            class="bookshelf-item-page__cover"
          />
        </div>
        <div class="bookshelf-item-page__details">
          <h2 class="bookshelf-item-page__title">
            {{ book.tokenName }}
          </h2>
          <marquee
            :text="[
              $t('bookshelf-item-page.badge-1'),
              $t('bookshelf-item-page.badge-2'),
            ]"
          />

          <collapse>
            <template #head="{ collapse }">
              <div
                class="bookshelf-item-page__description-wrapper"
                @click="collapse.toggle"
              >
                <p>
                  {{ $t('bookshelf-item-page.description-lbl') }}
                </p>
                <icon
                  class="bookshelf-item-page__description-icon"
                  :class="{
                    'bookshelf-item-page__description-icon--rotated':
                      collapse.isOpen,
                  }"
                  :name="$icons.chevronDown"
                />
              </div>
            </template>
            <p class="bookshelf-item-page__description">
              {{ book.description }}
            </p>
          </collapse>

          <book-details :book="book" />

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
    <img
      class="bookshelf-item-page__background"
      src="/images/fancy-lines.png"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Loader,
  AppButton,
  PurchasingModal,
  PurchasingSuccessModal,
  Marquee,
  Collapse,
  Icon,
} from '@/common'

import { BookDetails } from '@/pages/bookshelf'
import { ref, watch, computed } from 'vue'
import { ErrorHandler } from '@/helpers'

import { FullBookInfo, useBooks } from '@/composables'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'

const props = defineProps<{
  id: string
}>()

const networkStore = useNetworksStore()
const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const isLoaded = ref(false)
const isPurchaseModalShown = ref(false)
const isPurchaseSuccessModalShown = ref(false)

const { getBookById } = useBooks()

const book = ref<FullBookInfo | undefined>()

const submit = async () => {
  try {
    isPurchaseModalShown.value = false
    isPurchaseSuccessModalShown.value = true
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const init = async () => {
  isLoaded.value = false
  try {
    const data = await getBookById(props.id)

    book.value = data
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    router.push({ name: ROUTE_NAMES.bookshelf })
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

watch(
  () => provider.value.chainId,
  () => {
    if (
      !networkStore.list.some(
        network => network.chain_id === Number(provider.value.chainId),
      )
    )
      return

    init()
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
  gap: toRem(20);
}

.bookshelf-item-page__title {
  text-transform: uppercase;
  max-width: 100%;
  word-wrap: break-word;

  @include respond-to(medium) {
    text-align: center;
  }
}

.bookshelf-item-page__purchase-btn {
  text-transform: uppercase;
  width: 100%;
  height: toRem(60);
  font-size: toRem(24);
  font-weight: 700;
  line-height: 120%;
  margin-top: toRem(25);
}

.bookshelf-item-page__description-wrapper {
  background-color: var(--background-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(14);
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &:hover {
    cursor: pointer;
    background-color: var(--background-primary-light);
  }
}

.bookshelf-item-page__description {
  padding: toRem(20);
  max-width: 100%;
  word-break: break-all;
  white-space: pre-wrap;
}

.bookshelf-item-page__description-icon {
  --size: #{toRem(20)};

  max-width: var(--size);
  max-height: var(--size);
  transition: 0.2s ease-in-out;
  transition-property: transform;

  &--rotated {
    transform: rotate(180deg);
  }
}

.bookshelf-item-page__background {
  @include background-image;
}
</style>
