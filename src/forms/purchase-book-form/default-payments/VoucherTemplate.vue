<template>
  <template v-if="!isLoading">
    <error-message
      v-if="isLoadFailed"
      :message="$t('voucher-template.loading-error-msg')"
    />

    <template v-else>
      <!-- Voucher Info -->
      <message-field
        v-if="!isVoucherSupported || !isEnoughVoucherTokensForBuy"
        :title="voucherErrorTitle"
      />
      <template v-else>
        <readonly-field
          :label="$t('voucher-template.voucher-token-lbl')"
          :value="book.voucherTokenContract"
        />
        <readonly-field
          :label="$t('voucher-template.voucher-token-amount-lbl')"
          :value="formattedVoucherTokenAmount"
        />
      </template>
    </template>
  </template>
  <loader v-else />

  <teleport to="#purchase-book-form__preview">
    <book-preview :book="book" />
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ethers } from 'ethers'

import { Loader, ErrorMessage, BookPreview } from '@/common'
import { MessageField, ReadonlyField } from '@/fields'

import { PurchaseFormKey } from '@/types'
import { useBalance, useGenerator } from '@/composables'

import {
  ErrorHandler,
  formatAssetFromWei,
  getBlockExplorerLink,
  safeInject,
} from '@/helpers'
import { BN, BnLike } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { FORM_STATES, TOKEN_TYPES } from '@/enums'
import { useI18n } from 'vue-i18n'
import { UseImageEditor } from 'simple-fabric-vue-image-editor'

const {
  bookInfo: book,
  formState,
  submit,
  isFormValid,
  successMessage,
} = safeInject(PurchaseFormKey)

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const { getBalance, isLoadFailed, balance } = useBalance()
const { sendBuyWithVoucherRequest, createNewGenerationTask, uploadBanner } =
  useGenerator()

const isLoading = ref(true)

const isVoucherSupported = computed(
  () => book.voucherTokenContract !== ethers.constants.AddressZero,
)

const formattedVoucherTokenAmount = computed(() =>
  book.voucherTokensAmount
    ? formatAssetFromWei(book.voucherTokensAmount as BnLike, 2)
    : '',
)

const voucherErrorTitle = computed(() =>
  !isVoucherSupported.value
    ? t('voucher-template.voucher-token-unsupported-msg')
    : t('voucher-template.not-enough-voucher-tokens-msg', {
        amount: formattedVoucherTokenAmount.value,
      }),
)

const isEnoughVoucherTokensForBuy = computed(
  () => new BN(balance.value).compare(formattedVoucherTokenAmount.value) >= 0,
)

const submitFunc = async (editorInstance: UseImageEditor | null) => {
  if (!editorInstance || !provider.value.selectedAddress) return

  formState.value = FORM_STATES.pending
  try {
    const banner = await editorInstance.canvasToFormData('Document')

    if (!banner) throw new Error('Failed to format canvas to FormData')

    const currentTask = await createNewGenerationTask({
      account: provider.value.selectedAddress,
      bookId: book.id,
      chainId: Number(provider.value.chainId),
    })

    const generatedTask = await uploadBanner(currentTask.id, banner)

    const txHash = await sendBuyWithVoucherRequest(
      book.voucherTokenContract,
      book.voucherTokensAmount,
      Number(generatedTask.id),
    )

    if (!txHash) throw new Error('Failed to send transaction')

    successMessage.value = {
      message: t('voucher-template.voucher-payment-msg'),
      txLink: getBlockExplorerLink(provider.value.chainId!, txHash, 'tx'),
    }

    formState.value = FORM_STATES.success
  } catch (error) {
    ErrorHandler.process(error)
    formState.value = FORM_STATES.active
  }
}

// this submit function will be invoked on the top level of purchase form
submit.value = submitFunc
isFormValid.value = () =>
  isVoucherSupported.value && isEnoughVoucherTokensForBuy.value

watch(
  () => provider.value.selectedAddress,
  async () => {
    if (!isVoucherSupported.value) {
      isLoading.value = false
      return
    }

    isLoading.value = true
    try {
      await getBalance(book.voucherTokenContract, TOKEN_TYPES.erc20)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      isLoadFailed.value = true
    }
    isLoading.value = false
  },
  {
    immediate: true,
  },
)
</script>
