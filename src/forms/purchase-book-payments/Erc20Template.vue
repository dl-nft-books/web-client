<template>
  <input-field
    v-model="form.tokenAddress"
    :label="$t('purchase-book-form.token-address-lbl')"
    :error-message="getFieldErrorMessage('tokenAddress')"
    :disabled="isFormDisabled"
    @blur="touchField('tokenAddress')"
  />

  <loader v-if="isLoading" />

  <template v-else-if="isPriceAndBalanceLoaded">
    <template v-if="isLoadFailed">
      <message-field
        v-if="isTokenAddressUnsupported"
        :title="$t('purchase-book-form.unsupported-token-title')"
        :subtitle="$t('purchase-book-form.unsupported-token-subtitle')"
      />

      <error-message
        v-else
        :message="$t('purchase-book-form.loading-error-msg')"
      />
    </template>

    <template v-else-if="tokenPrice">
      <readonly-field
        :label="$t('purchase-book-form.token-amount-lbl')"
        :value="formattedTokenAmount"
      />
      <p
        v-if="!isEnoughBalanceForBuy"
        class="erc20-template__not-enough-balance-msg"
      >
        {{ $t('purchase-book-form.not-enough-balance-msg') }}
      </p>

      <promocode-template
        ref="promocodeRef"
        :token-type="TOKEN_TYPES.erc20"
        :token-address="form.tokenAddress"
      />

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
        class="erc20-template__purchase-btn"
        size="small"
        type="submit"
        :text="$t('purchase-book-form.generate-btn')"
        :disabled="isFormDisabled || !isEnoughBalanceForBuy"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, toRef, inject } from 'vue'
import { debounce } from 'lodash'

import { AppButton, Loader, ErrorMessage } from '@/common'
import { PromocodeTemplate } from '@/forms/purchase-book-payments'
import {
  InputField,
  MessageField,
  ReadonlyField,
  TextareaField,
} from '@/fields'
import { useFormValidation, useBalance } from '@/composables'
import { required, address, minLength, maxLength } from '@/validators'

import { PROMOCODE_LENGTH, MAX_FIELD_LENGTH } from '@/const'
import { Book, Promocode, PurchaseFormKey } from '@/types'
import { ExposedPromocodeRef } from '@/forms/purchase-book-payments/PromocodeTemplate.vue'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { BN } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { TOKEN_TYPES } from '@/enums'

const props = defineProps<{
  book: Book
}>()

const { platform: currentPlatform, isFormDisabled } = inject(PurchaseFormKey)

const form = reactive({
  tokenAddress: '',
  signature: '',
  promocode: '',
})

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  isTokenAddressUnsupported,
  tokenPrice,
  loadBalanceAndPrice: _loadBalanceAndPrice,
} = useBalance(currentPlatform)

const loadBalanceAndPrice = debounce(async () => {
  isLoading.value = true
  await _loadBalanceAndPrice(form.tokenAddress, TOKEN_TYPES.erc20)
  isLoading.value = false
}, 400)

const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    signature: { required },
    promocode: {
      minLength: minLength(PROMOCODE_LENGTH),
      maxLength: maxLength(PROMOCODE_LENGTH),
    },
    tokenAddress: { required, address },
  },
)

const isLoading = ref(false)
const promocodeRef = ref<ExposedPromocodeRef | null>(null)
const promocode = ref<Promocode | null>(null)

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
  promocode: promocode,
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
  () => [form.tokenAddress, provider.value.selectedAddress],
  () => {
    if (!form.tokenAddress) return

    loadBalanceAndPrice()
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.erc20-template__not-enough-balance-msg {
  font-size: toRem(12);
  text-align: left;
  width: 100%;
  color: var(--error-main);
}

.erc20-template__purchase-btn {
  margin-inline: auto;
  margin-top: toRem(20);
  min-width: toRem(144);
  min-height: toRem(48);
}
</style>
