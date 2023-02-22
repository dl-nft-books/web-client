<template>
  <template v-if="isPriceAndBalanceLoaded">
    <error-message
      v-if="isLoadFailed"
      :message="$t('purchase-book-form.loading-error-msg')"
    />
    <template v-else-if="tokenPrice">
      <readonly-field
        :label="$t('purchase-book-form.token-amount-lbl')"
        :value="formattedTokenAmount"
      />
      <p
        v-if="!isEnoughBalanceForBuy"
        class="native-template__not-enough-balance-msg"
      >
        {{ $t('purchase-book-form.not-enough-balance-msg') }}
      </p>

      <promocode-template ref="promocodeRef" />

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
        class="native-template__purchase-btn"
        size="small"
        type="submit"
        :text="$t('purchase-book-form.generate-btn')"
        :disabled="isFormDisabled || !isEnoughBalanceForBuy"
      />
    </template>
  </template>
  <loader v-else />
</template>

<script setup lang="ts">
import { computed, reactive, watch, toRef, ref, inject } from 'vue'

import { BN } from '@/utils/math.util'

import { TextareaField, ReadonlyField } from '@/fields'

import { ErrorMessage, Loader, AppButton } from '@/common'
import { useBalance, useFormValidation } from '@/composables'
import { PromocodeTemplate } from '@/forms/purchase-book-payments'
import { Book, Promocode, PurchaseFormKey } from '@/types'

import { required, minLength, maxLength } from '@/validators'
import { PROMOCODE_LENGTH, MAX_FIELD_LENGTH } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { ExposedPromocodeRef } from '@/forms/purchase-book-payments/PromocodeTemplate.vue'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { TOKEN_TYPES } from '@/enums'

const props = defineProps<{
  book: Book
}>()

const { platform: currentPlatform, isFormDisabled } = inject(PurchaseFormKey)

const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  tokenPrice,
  loadBalanceAndPrice,
} = useBalance(currentPlatform)

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const form = reactive({
  tokenAddress: '',
  signature: '',
  promocode: '',
})

const promocodeRef = ref<ExposedPromocodeRef | null>(null)
const promocode = ref<Promocode | null>(null)

const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    signature: { required },
    promocode: {
      minLength: minLength(PROMOCODE_LENGTH),
      maxLength: maxLength(PROMOCODE_LENGTH),
    },
  },
)
const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  return new BN(props.book.price, { decimals: tokenPrice.value.token.decimals })
    .fromFraction(tokenPrice.value.token.decimals)
    .div(tokenPrice.value.price)
    .toString()
})

const isEnoughBalanceForBuy = computed(
  () => new BN(balance.value).compare(formattedTokenAmount.value) >= 0,
)

defineExpose<ExposedFormRef>({
  isFormValid: () => isFormValid() && promocodeRef.value?.isPromocodeValid(),
  tokenAmount: formattedTokenAmount,
  tokenPrice: tokenPrice,
  tokenAddress: toRef(form, 'tokenAddress'),
  signature: toRef(form, 'signature'),
  promocode,
})

watch(
  () => promocodeRef.value?.tokenPrice,
  () => {
    if (!promocodeRef.value?.tokenPrice) return

    promocode.value = promocodeRef.value.promocode
    tokenPrice.value = promocodeRef.value.tokenPrice
  },
)

watch(
  () => provider.value.selectedAddress,
  () => {
    loadBalanceAndPrice(form.tokenAddress, TOKEN_TYPES.native)
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.native-template__not-enough-balance-msg {
  font-size: toRem(12);
  text-align: left;
  width: 100%;
  color: var(--error-main);
}

.native-template__purchase-btn {
  margin-inline: auto;
  margin-top: toRem(20);
  min-width: toRem(144);
  min-height: toRem(48);
}
</style>
