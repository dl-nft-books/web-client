<template>
  <template v-if="!isLoading">
    <error-message
      v-if="isLoadFailed"
      :message="$t('purchase-book-form.loading-error-msg')"
    />

    <template v-else>
      <!-- Voucher Info -->
      <message-field
        v-if="!isVoucherSupported || !isEnoughVoucherTokensForBuy"
        :title="voucherErrorTitle"
      />
      <template v-else>
        <readonly-field
          :label="$t('purchase-book-form.voucher-token-lbl')"
          :value="book.voucherTokenContract"
        />
        <readonly-field
          :label="$t('purchase-book-form.voucher-token-amount-lbl')"
          :value="formattedVoucherTokenAmount"
        />
      </template>
    </template>
  </template>
  <loader v-else />
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRef, watch } from 'vue'
import { ethers } from 'ethers'

import { Loader, ErrorMessage } from '@/common'
import { MessageField, ReadonlyField } from '@/fields'

import { FullBookInfo } from '@/types'
import { useBalance } from '@/composables'

import { ErrorHandler, formatAssetFromWei } from '@/helpers'
import { BN } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { TOKEN_TYPES } from '@/enums'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  book: FullBookInfo
}>()

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const { getBalance, isLoadFailed, balance } = useBalance()

const form = reactive({
  tokenAddress: props.book.voucherTokenContract,
  signature: '',
  promocode: '',
})

const isLoading = ref(true)

const isVoucherSupported = computed(
  () => props.book.voucherTokenContract !== ethers.constants.AddressZero,
)

const formattedVoucherTokenAmount = computed(() =>
  props.book.voucherTokensAmount
    ? formatAssetFromWei(props.book.voucherTokensAmount, 2)
    : '',
)

const voucherErrorTitle = computed(() =>
  !isVoucherSupported.value
    ? t('purchase-book-form.voucher-token-unsupported-msg')
    : t('purchase-book-form.not-enough-voucher-tokens-msg', {
        amount: formattedVoucherTokenAmount.value,
      }),
)

const isEnoughVoucherTokensForBuy = computed(
  () => new BN(balance.value).compare(formattedVoucherTokenAmount.value) >= 0,
)

defineExpose<Omit<ExposedFormRef, 'promocode' | 'tokenPrice'>>({
  isFormValid: () =>
    isVoucherSupported.value && isEnoughVoucherTokensForBuy.value,
  tokenAmount: formattedVoucherTokenAmount,
  tokenAddress: toRef(form, 'tokenAddress'),
})

watch(
  () => provider.value.selectedAddress,
  async () => {
    if (!isVoucherSupported.value) {
      isLoading.value = false
      return
    }

    isLoading.value = true
    try {
      await getBalance(props.book.voucherTokenContract, TOKEN_TYPES.erc20)
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
