<script lang="ts" setup>
import { AppButton } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const handleProviderClick = () => {
  if (provider.value.selectedAddress) {
    return
  }
  provider.value.connect()
}

withDefaults(
  defineProps<{
    isNoConnected: boolean
  }>(),
  {
    isNoConnected: false,
  },
)
</script>

<template>
  <div class="my-nfts-no-data">
    <div class="my-nfts-no-data__img-wrapper">
      <img
        class="my-nfts-no-data__img"
        src="/images/books-no-data.png"
        alt="Books no data image"
      />
    </div>
    <div class="my-nfts-no-data__content">
      <template v-if="isNoConnected">
        <p class="my-nfts-no-data__message">
          {{ $t('my-nfts-no-data.connect-metamask-message') }}
        </p>
      </template>
      <template v-else>
        <p class="my-nfts-no-data__message">
          {{ $t('my-nfts-no-data.message-first') }}
        </p>
        <p class="my-nfts-no-data__message">
          {{ $t('my-nfts-no-data.message-second') }}
        </p>
      </template>

      <template v-if="isNoConnected">
        <app-button
          class="my-nfts-no-data__marketplace-btn"
          size="large"
          :text="$t('my-nfts-no-data.connect-metamask-btn')"
          :icon-left="$icons.metamask"
          @click="handleProviderClick"
        />
      </template>
      <template v-else>
        <app-button
          class="my-nfts-no-data__marketplace-btn"
          size="large"
          :icon-right="$icons.arrowRight"
          :text="$t('my-nfts-no-data.marketplace-btn')"
          :route="{ name: $routes.bookshelf }"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-nfts-no-data {
  display: grid;
  grid-template-columns: minmax(toRem(270), toRem(370)) minmax(toRem(350), 1fr);
  align-items: center;
  grid-gap: toRem(70);

  @include respond-to(tablet) {
    grid-template-columns: 1fr;
  }
}

.my-nfts-no-data__img-wrapper {
  max-width: toRem(370);

  @include respond-to(tablet) {
    justify-self: center;
  }
}

.my-nfts-no-data__img {
  width: 100%;
}

.my-nfts-no-data__content {
  display: flex;
  flex-direction: column;

  @include respond-to(tablet) {
    align-items: center;
    justify-self: center;
  }
}

.my-nfts-no-data__message {
  font-size: toRem(24);

  @include respond-to(tablet) {
    text-align: center;
  }
}

.my-nfts-no-data__marketplace-btn {
  margin-top: toRem(44);
}
</style>
