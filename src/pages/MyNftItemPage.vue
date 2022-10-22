<script lang="ts" setup>
import {
  Loader,
  ErrorMessage,
  NftDescription,
  Tabs,
  NftDetails,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { Book } from '@/types'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

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
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const currentTab = ref(TABS.myPurchase.id)

const book = ref<Book | undefined>()

const route = useRoute()

const init = async () => {
  try {
    await loadBook()
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const loadBook = async () => {
  book.value = {
    id: route.params.id,
    title: 'Blockchain and decentralized systems, Volume 1',
    price: {
      amount: 109,
      assetCode: 'USD',
    },
    coverUrl:
      'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80',
    description:
      'Lörem ipsum semiskop plaktig. Bent abvalens trera vipysamma. Rerade prer derade. Digisk nebelt fask. sdscqae \n' +
      'Mack nitevis. Mikropp antelånas londe. Tism svenna sitt liv i preliga. Sögisk euroråse belig. \n' +
      'Pögt ont puhet och supravinade. Dis vil gesåbelt och vaheten. Aning elektrogram eftersom miligen. Renyde korat. \n',
    meta: {
      volume: 'Volume 2',
    },
    token: {
      amount: '0,0056',
      assetCode: 'BTC',
    },
    document: {
      name: 'BDS_volume1.pdf',
    },
    signature:
      'Lörem ipsum semiskop plaktig. Bent abvalens trera vipysamma. Rerade prer derade. Digisk nebelt fask. sdscqae',
    purchaseDate: '2010-04-02T14:12:07',
  } as Book
}

init()
</script>

<template>
  <div class="my-nft-item-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('my-nft-item-page.loading-error-msg')" />
      </template>
      <template v-else-if="book">
        <div class="my-nft-item-page__cover-wrp">
          <img
            :src="book.coverUrl"
            :alt="book.title"
            class="my-nft-item-page__cover"
          />
        </div>
        <div class="my-nft-item-page__details">
          <h2 class="my-nft-item-page__title">
            {{ book.title }}
          </h2>
          <tabs
            v-model:current-tab-id="currentTab"
            :tabs="Object.values(TABS)"
            class="my-nft-item-page__tabs"
          />

          <template v-if="currentTab === TABS.bookDescription.id">
            <nft-description :description="book.description" />
          </template>

          <template v-if="currentTab === TABS.myPurchase.id">
            <nft-details :book="book" />
          </template>
        </div>
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.my-nft-item-page {
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

.my-nft-item-page__cover-wrp {
  width: 100%;
}

.my-nft-item-page__cover {
  width: 100%;
  height: auto;

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
  font-size: toRem(48);
  line-height: 1.2;
  font-weight: 900;
  margin-bottom: toRem(65);

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(30);
  }
}

.my-nft-item-page__tabs {
  margin-bottom: toRem(40);
}
</style>
