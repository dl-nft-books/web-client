<template>
  <div class="web3-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('web3-page.loading-error-msg')" />
      </template>
      <template v-else>
        <div class="web3-page__list">
          <div class="web3-page__card">
            <div
              class="web3-page__card-indicator"
              :class="{
                'web3-page__card-indicator--active': provider.isConnected.value,
              }"
            />
            <h2 class="web3-page__card-title">
              {{ provider.selectedProvider.value }}
            </h2>
            <span class="web3-page__card-name">
              {{ provider.selectedAddress.value }}
            </span>
            <span class="web3-page__txt">
              {{ `chainId: ${provider.chainId.value}` }}
            </span>
            <app-button
              class="web3-page__card-btn"
              schemes="flat"
              modifications="border-rounded small"
              :text="provider.selectedAddress.value || 'Connect'"
              @click="provider.connect"
              :disabled="provider.isConnected.value"
            />
            <app-button
              class="web3-page__card-btn"
              schemes="flat"
              modifications="border-rounded small"
              :text="'switch chain to kovan'"
              @click="provider.switchChain(42)"
            />
            <app-button
              class="web3-page__card-btn"
              schemes="flat"
              modifications="border-rounded small"
              :text="'add chain optimism'"
              @click="addChainOptimism"
            />
            <app-button
              class="web3-page__card-btn"
              schemes="flat"
              modifications="border-rounded small"
              :text="'sendTx'"
              @click="sendTx"
            />
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script lang="ts">
import { AppButton, Loader, ErrorMessage } from '@/common'

import { defineComponent, ref } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'
import { useProvider } from '@/composables'

export default defineComponent({
  name: 'web3-page',
  components: { ErrorMessage, Loader, AppButton },
  setup() {
    const isLoaded = ref(false)
    const isLoadFailed = ref(false)

    const web3Store = useWeb3ProvidersStore()
    const provider = useProvider()

    const init = async () => {
      try {
        await web3Store.detectProviders()
        await provider.init(web3Store.providers[0])
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        isLoadFailed.value = true
      }
      isLoaded.value = true
    }

    const addChainOptimism = async () => {
      try {
        await provider.addChain(10, 'Optimism', 'https://mainnet.optimism.io')
      } catch (error) {
        ErrorHandler.process(error)
      }
    }

    const sendTx = async () => {
      try {
        await provider.signAndSendTx({
          from: {
            wallet: '0xC87B0398F86276D3D590A14AB53fF57185899C42',
          },
          to: {
            wallet: '0x0b216630Ec5adfA4ff7423A29b7f8a98F047DdD9',
          },
          contents: 'Hello, Bob!',
        })
      } catch (error) {
        ErrorHandler.process(error)
      }
    }

    init()

    return {
      isLoaded,
      isLoadFailed,

      provider,

      addChainOptimism,
      sendTx,
    }
  },
})
</script>

<style lang="scss" scoped>
.web3-page__list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: toRem(24);
}

.web3-page__card {
  position: relative;
  display: grid;
  gap: toRem(8);
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(8);
  padding: toRem(12);
}

.web3-page__card-indicator {
  position: absolute;
  top: toRem(12);
  right: toRem(12);
  width: toRem(12);
  height: toRem(12);
  border-radius: 50%;
  background: var(--error-main);

  &--active {
    background: var(--success-main);
  }
}

.web3-page__card-btn {
  width: 100%;
}
</style>
