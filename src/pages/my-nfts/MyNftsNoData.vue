<template>
  <div class="my-nfts-no-data">
    <img
      class="my-nfts-no-data__img"
      src="/images/books-no-data.png"
      alt="Books no data image"
    />
    <p v-if="errorMessage" class="my-nfts-no-data__message">
      {{ errorMessage }}
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
      v-else-if="isWrongChain"
      class="my-nfts-no-data__marketplace-btn"
      :text="$t('my-nfts-no-data.switch-chain-btn')"
      :icon-left="$icons.refresh"
      @click="switchNetwork($config.DEFAULT_CHAIN_ID)"
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
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { AppButton } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { switchNetwork } from '@/helpers'
import { useI18n } from 'vue-i18n'

type SCHEME = 'not-connected' | 'wrong-chain' | 'default'

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const props = withDefaults(
  defineProps<{
    scheme?: SCHEME
  }>(),
  {
    scheme: 'default',
  },
)

const isNotConnected = computed(() => props.scheme === 'not-connected')
const isWrongChain = computed(() => props.scheme === 'wrong-chain')
const errorMessage = computed(() => {
  if (isNotConnected.value) return t('my-nfts-no-data.connect-metamask-message')
  else if (isWrongChain.value) return t('my-nfts-no-data.wrong-chain-message')

  return ''
})
</script>

<style lang="scss" scoped>
.my-nfts-no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
}

.my-nfts-no-data__img {
  width: 100%;
  max-width: toRem(370);
  margin-bottom: toRem(44);
}

.my-nfts-no-data__message {
  @include info-headline;

  color: var(--text-primary-invert-main);
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
