<template>
  <div class="web3-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('web3-page.loading-error-msg')" />
      </template>
      <template v-else>
        <div class="web3-page__list">
          <div
            class="web3-page__card"
            v-for="provider in providers"
            :key="provider.selectedProvider.value"
          >
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
              @click="connect(provider)"
              :disabled="provider.isConnected.value"
            />
            <app-button
              class="web3-page__card-btn"
              schemes="flat"
              modifications="border-rounded small"
              :text="'switch chain to kovan'"
              @click="switchChain(provider, 42)"
            />
            <app-button
              class="web3-page__card-btn"
              schemes="flat"
              modifications="border-rounded small"
              :text="'add chain optimism'"
              @click="
                addChain(provider, { id: 10, name: 'optimism', rpcUrl: '' })
              "
            />
            <app-button
              class="web3-page__card-btn"
              schemes="flat"
              modifications="border-rounded small"
              :text="'sendTx'"
              @click="
                sendTx(
                  provider,
                  transactionsBodyToTest[provider.selectedProvider.value],
                )
              "
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
import { TxRequestBody, UseProvider } from '@/types'
import bs58 from 'bs58'
import { Transaction } from '@solana/web3.js'

const transactionsBodyToTest = {
  metamask: {
    from: '0x0b216630ec5adfa4ff7423a29b7f8a98f047ddd9',
    to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
    value: '0x5',
    maxFeePerGas: '0x9502f916',
    maxPriorityFeePerGas: '0x9502F900',
  },
  coinbase: {
    from: '0x4c94f25007931Af6eE059A240FbEF8cb7a944080',
    to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
    value: '0x5',
    maxFeePerGas: '0x9502f916',
    maxPriorityFeePerGas: '0x9502F900',
  },
  phantom:
    '4MUn5mQ9ujcRJCLvt7fUVwcDoYtGhoJJNzXaG28Fbwb5W8pGRqLNPFLV5JSuPwjrWMKzdaTiBicBz3c8jJrtHpHnC9xtwzF95LFrazGqAvZBrZ4C84bsxhvEAuuedpQhPKhY9LRGZdeNBWFy6gJx3LWoyRMhvY2KGEtbTCXT5G5ESYzRZN98PR2DcFndvwMaCTMe6SUJGMXR2SFPvvRJdW89EPFrYuf64P5AjF4C4aGCTRrP73YBNUzuS3TBx8U5YSsHdfttSV1iVgkEj2u6sP27vUKXRCAdV2ZkqpxzVu5Bf2MruJEuouUTGa6BEeFrmLtzdQVaUE2uUzNoxYWDghd4UuNn8ntfdsuqhchGYfqGj5tFUmN1MZwHeL91ZT96EbVtMPPPvscLmhkVWGPDmC3RnsuhKw3k13aixEAmM7XB8qjA9GzAQMDcw3sX7yxRW12WBSTatFt8WkiG5LBVPB2HMjSmCdJC1xsUiVRNJ8Wbt73rMLmbwYjwtL4i4gMnXCqvZPNgszqhNhUeKe3WgXCNwTxrV6mx2H7NmyEZeuTbnYBsaZux7sNSTYsaagLtfs5Dx2g27DMb2fEc4DBTLZkVTW4iXMqNNcuwYtW6kHEMrjgKAuUhsEToXwun3PvgwguYJxSDJShSYJ1fc6QDbkJ1Vf6ehCqw4yD6ogn6tJDRfDyi8bKYCp9UkNjKeiFbpr9naLpkBqjLNekhFcpxDSj1zV1kXWEoCw2Fs84S73EYD8Kd2nC9ktAMVsyhEUBxJ1FE9i7b8n3fSyDZVZguw1GfQG36PaX3jTTE7qVcANXxj6ud',
  solflare:
    '4MUn5mQ9ujcRJCLvt7fUVwcDoYtGhoJJNzXaG28Fbwb5W8pGRqLNPFLV5JSuPwjrWMKzdaTiBicBz3c8jJrtHpHnC9xtwzF95LFrazGqAvZBrZ4C84bsxhvEAuuedpQhPKhY9LRGZdeNBWFy6gJx3LWoyRMhvY2KGEtbTCXT5G5ESYzRZN98PR2DcFndvwMaCTMe6SUJGMXR2SFPvvRJdW89EPFrYuf64P5AjF4C4aGCTRrP73YBNUzuS3TBx8U5YSsHdfttSV1iVgkEj2u6sP27vUKXRCAdV2ZkqpxzVu5Bf2MruJEuouUTGa6BEeFrmLtzdQVaUE2uUzNoxYWDghd4UuNn8ntfdsuqhchGYfqGj5tFUmN1MZwHeL91ZT96EbVtMPPPvscLmhkVWGPDmC3RnsuhKw3k13aixEAmM7XB8qjA9GzAQMDcw3sX7yxRW12WBSTatFt8WkiG5LBVPB2HMjSmCdJC1xsUiVRNJ8Wbt73rMLmbwYjwtL4i4gMnXCqvZPNgszqhNhUeKe3WgXCNwTxrV6mx2H7NmyEZeuTbnYBsaZux7sNSTYsaagLtfs5Dx2g27DMb2fEc4DBTLZkVTW4iXMqNNcuwYtW6kHEMrjgKAuUhsEToXwun3PvgwguYJxSDJShSYJ1fc6QDbkJ1Vf6ehCqw4yD6ogn6tJDRfDyi8bKYCp9UkNjKeiFbpr9naLpkBqjLNekhFcpxDSj1zV1kXWEoCw2Fs84S73EYD8Kd2nC9ktAMVsyhEUBxJ1FE9i7b8n3fSyDZVZguw1GfQG36PaX3jTTE7qVcANXxj6ud',
}

export default defineComponent({
  name: 'web3-page',
  components: { ErrorMessage, Loader, AppButton },
  setup() {
    const isLoaded = ref(false)
    const isLoadFailed = ref(false)

    const web3Store = useWeb3ProvidersStore()

    const providers: UseProvider[] = []

    const init = async () => {
      try {
        await web3Store.detectProviders()

        for (const designatedProvider of web3Store.providers) {
          const provider = useProvider()

          await provider.init(designatedProvider)
          providers.push(provider)
        }
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        isLoadFailed.value = true
      }
      isLoaded.value = true
    }

    const connect = async (provider: UseProvider) => {
      try {
        await provider.connect()
      } catch (error) {
        ErrorHandler.process(error)
      }
    }

    const switchChain = async (provider: UseProvider, chainId: number) => {
      try {
        await provider.switchChain(chainId)
      } catch (error) {
        ErrorHandler.process(error)
      }
    }

    const addChain = async (
      provider: UseProvider,
      chainParams: { id: number; name: string; rpcUrl: string },
    ) => {
      try {
        await provider.addChain(
          chainParams.id,
          chainParams.name,
          chainParams.rpcUrl,
        )
      } catch (error) {
        ErrorHandler.process(error)
      }
    }

    const sendTx = async (
      provider: UseProvider,
      transactionBody: TxRequestBody,
    ) => {
      try {
        const txBody =
          typeof transactionBody === 'string'
            ? Transaction.from(bs58.decode(transactionBody))
            : transactionBody
        await provider.signAndSendTx(txBody)
      } catch (error) {
        ErrorHandler.process(error)
      }
    }

    init()

    return {
      isLoaded,
      isLoadFailed,

      providers,

      connect,
      switchChain,
      addChain,
      sendTx,

      transactionsBodyToTest,
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
