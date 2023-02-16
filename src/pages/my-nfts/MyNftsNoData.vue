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
      <p v-if="isNotConnected" class="my-nfts-no-data__message">
        {{ $t('my-nfts-no-data.connect-metamask-message') }}
      </p>
      <template v-else>
        <p class="my-nfts-no-data__message">
          {{ $t('my-nfts-no-data.message-first') }}
        </p>
        <p class="my-nfts-no-data__message">
          {{ $t('my-nfts-no-data.message-second') }}
        </p>
      </template>
      <app-button
        v-if="isNotConnected"
        class="my-nfts-no-data__marketplace-btn"
        :text="$t('my-nfts-no-data.connect-metamask-btn')"
        :icon-left="$icons.metamask"
        @click="provider.connect"
      />
      <app-button
        v-else
        class="my-nfts-no-data__marketplace-btn"
        size="large"
        :icon-right="$icons.arrowRight"
        :text="$t('my-nfts-no-data.marketplace-btn')"
        :route="{ name: $routes.bookshelf }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useWeb3ProvidersStore } from '@/store'

const { provider } = useWeb3ProvidersStore()

withDefaults(
  defineProps<{
    isNotConnected?: boolean
  }>(),
  {
    isNotConnected: false,
  },
)
</script>

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
  @include info-headline;

  @include respond-to(tablet) {
    text-align: center;
  }
}

.my-nfts-no-data__marketplace-btn {
  margin-top: toRem(44);
  min-height: toRem(74);
  min-width: toRem(296);
  font-weight: 700;
  font-size: toRem(20);

  @include respond-to(small) {
    min-width: 100%;
  }
}
</style>
