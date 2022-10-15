<script lang="ts" setup>
import { Loader, ErrorMessage, AppButton, Icon } from '@/common'

import { ErrorHandler } from '@/helpers'
import { Book } from '@/types'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { formatFiatAsset } from '@/helpers'

const isLoaded = ref(false)
const isLoadFailed = ref(false)
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
  } as Book
}

init()
</script>

<template>
  <div class="bookshelf-item-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('bookshelf-item-page.loading-error-msg')" />
      </template>
      <template v-else>
        <div class="bookshelf-item-page__cover-wrp">
          <img
            :src="book.coverUrl"
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
              {{ formatFiatAsset(book.price.amount, book.price.assetCode) }}
            </div>
            <app-button
              class="bookshelf-item-page__purchase-btn"
              :text="$t('bookshelf-item-page.purchase-btn')"
            />
          </div>
          <div class="bookshelf-item-page__badges">
            <div class="bookshelf-item-page__badge">
              <icon
                class="bookshelf-item-page__badge-icon"
                :name="$icons.badgeCircleStar"
              />
              <span class="bookshelf-item-page__badge-text">
                {{ $t('bookshelf-item-page.badge-1') }}
              </span>
            </div>
            <div class="bookshelf-item-page__badge">
              <icon
                class="bookshelf-item-page__badge-icon"
                :name="$icons.badgePencil"
              />
              <span class="bookshelf-item-page__badge-text">
                {{ $t('bookshelf-item-page.badge-2') }}
              </span>
            </div>
          </div>
          <p class="bookshelf-item-page__description">
            {{ book.description }}
          </p>
        </div>
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bookshelf-item-page {
  display: grid;

  $left-column: clamp(#{toRem(415)}, 40%, #{toRem(600)});
  $right-column: clamp(#{toRem(600)}, 55%, #{toRem(700)});

  grid-template-columns: $left-column $right-column;
  grid-column-gap: toRem(80);
  padding-top: toRem(40);
  padding-bottom: toRem(100);
  background: url('/images/background-cubes.png') no-repeat left bottom /
    contain;
}

.bookshelf-item-page__cover-wrp {
  width: 100%;
}

.bookshelf-item-page__cover {
  width: 100%;
  height: auto;
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
  margin-bottom: toRem(65);
}

.bookshelf-item-page__actions {
  display: flex;
  align-items: center;
  gap: toRem(20);
  border-bottom: toRem(1) solid var(--border-primary-main);
  padding-bottom: toRem(36);
  margin-bottom: toRem(40);
}

.bookshelf-item-page__price {
  text-transform: uppercase;
  font-size: toRem(48);
  line-height: 1.2;
  font-weight: 900;
}

.bookshelf-item-page__purchase-btn {
  min-width: toRem(300);
  margin-left: auto;
}

.bookshelf-item-page__badges {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bookshelf-item-page__badge {
  display: flex;
  align-items: center;
  gap: toRem(16);
  margin-bottom: toRem(40);
}

.bookshelf-item-page__badge-icon {
  width: toRem(60);
  height: toRem(60);
}

.bookshelf-item-page__badge-text {
  font-size: toRem(22);
  line-height: 1.2;
  font-weight: 500;
  font-style: italic;
}

.bookshelf-item-page__description {
  font-size: toRem(25);
  line-height: 1.2;
  font-weight: 400;
}
</style>
