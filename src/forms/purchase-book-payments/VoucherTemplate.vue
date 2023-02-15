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
          :value="book.voucherToken"
        />
        <readonly-field
          :label="$t('purchase-book-form.voucher-token-amount-lbl')"
          :value="formattedVoucherTokenAmount"
        />
      </template>

      <template v-if="isVoucherSupported && isEnoughVoucherTokensForBuy">
        <textarea-field
          v-model="form.signature"
          :placeholder="$t('purchase-book-form.signature-placeholder')"
          :maxlength="MAX_FIELD_LENGTH.signature"
          :label="$t('purchase-book-form.signature-lbl')"
          :error-message="getFieldErrorMessage('signature')"
          :disabled="isFormDisabled"
          @blur="touchField('signature')"
        />

        <!-- Starting NFT generation -->
        <app-button
          class="voucher-template__purchase-btn"
          size="small"
          type="submit"
          :text="$t('purchase-book-form.generate-btn')"
          :disabled="isFormDisabled"
        />
      </template>
    </template>
  </template>
  <loader v-else />
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref, toRef, watch } from 'vue'
import { ethers } from 'ethers'

import { Loader, AppButton, ErrorMessage } from '@/common'
import { MessageField, ReadonlyField, TextareaField } from '@/fields'

import { BookRecord } from '@/records'
import { PurchaseFormKey } from '@/types'
import { MAX_FIELD_LENGTH } from '@/const'
import { useBalance, useFormValidation, useContext } from '@/composables'
import { ErrorHandler, formatAssetFromWei } from '@/helpers'
import { BN } from '@/utils/math.util'
import { required } from '@/validators'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'

const props = defineProps<{
  book: BookRecord
}>()

const { platform: currentPlatform, isFormDisabled } = inject(PurchaseFormKey)

const { $t } = useContext()
const { provider } = storeToRefs(useWeb3ProvidersStore())

const { getBalance, isLoadFailed, balance } = useBalance(currentPlatform)

const form = reactive({
  tokenAddress: props.book.voucherToken,
  signature: '',
  promocode: '',
})

const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    signature: { required },
  },
)

const isLoading = ref(true)

const isVoucherSupported = computed(
  () => props.book.voucherToken !== ethers.constants.AddressZero,
)

const formattedVoucherTokenAmount = computed(() =>
  props.book.voucherTokenAmount
    ? formatAssetFromWei(props.book.voucherTokenAmount, 2)
    : '',
)

const voucherErrorTitle = computed(() =>
  !isVoucherSupported.value
    ? $t('purchase-book-form.voucher-token-unsupported-msg')
    : $t('purchase-book-form.not-enough-voucher-tokens-msg', {
        amount: formattedVoucherTokenAmount.value,
      }),
)

const isEnoughVoucherTokensForBuy = computed(
  () => new BN(balance.value).compare(formattedVoucherTokenAmount.value) >= 1,
)

defineExpose<Omit<ExposedFormRef, 'promocode' | 'tokenPrice'>>({
  isFormValid,
  tokenAmount: formattedVoucherTokenAmount,
  tokenAddress: toRef(form, 'tokenAddress'),
  signature: toRef(form, 'signature'),
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
      await getBalance(props.book.voucherToken, true)
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

<style lang="scss" scoped>
.voucher-template__purchase-btn {
  margin-inline: auto;
  margin-top: toRem(20);
  min-width: toRem(144);
  min-height: toRem(48);
}
</style>
