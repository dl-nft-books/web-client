<template>
  <input-field
    v-model="form.tokenAddress"
    :label="$t('erc20-template.token-address-lbl')"
    :error-message="getFieldErrorMessage('tokenAddress')"
    :disabled="isFormDisabled"
    @blur="touchField('tokenAddress')"
  />

  <loader v-if="isLoading" />

  <template v-else-if="isPriceAndBalanceLoaded">
    <template v-if="isLoadFailed">
      <message-field
        v-if="isTokenAddressUnsupported"
        :title="$t('erc20-template.unsupported-token-title')"
        :subtitle="$t('erc20-template.unsupported-token-subtitle')"
      />

      <error-message v-else :message="$t('erc20-template.loading-error-msg')" />
    </template>

    <template v-else-if="tokenPrice">
      <readonly-field
        :label="$t('erc20-template.token-amount-lbl')"
        :value="formattedTokenAmount"
      />
      <p
        v-if="!isEnoughBalanceForBuy"
        class="erc20-template__not-enough-balance-msg"
      >
        {{ $t('erc20-template.not-enough-balance-msg') }}
      </p>

      <promocode-template
        ref="promocodeRef"
        :book-id="book.id"
        :token-type="TOKEN_TYPES.erc20"
        :token-address="form.tokenAddress"
      />
    </template>
  </template>

  <teleport to="#purchase-book-form__preview">
    <book-preview :book="book" />
  </teleport>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { debounce } from 'lodash'

import { Loader, ErrorMessage, BookPreview } from '@/common'
import { PromocodeTemplate } from '@/forms/purchase-book-form'
import { InputField, MessageField, ReadonlyField } from '@/fields'
import { useFormValidation, useBalance, useNftTokens } from '@/composables'
import { required, address } from '@/validators'

import { Promocode, PurchaseFormKey } from '@/types'
import { ExposedPromocodeRef } from '@/forms/purchase-book-form/default-payments/PromocodeTemplate.vue'
import { BN, BnLike } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { FORM_STATES, TOKEN_TYPES } from '@/enums'
import { ErrorHandler, safeInject } from '@/helpers'
import { UseImageEditor } from 'simple-fabric-vue-image-editor'

const {
  bookInfo: book,
  formState,
  submit,
  isFormValid: _isFormValid,
} = safeInject(PurchaseFormKey)

const form = reactive({
  tokenAddress: '',
})

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const isFormDisabled = computed(() => formState.value === FORM_STATES.disabled)

const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  isTokenAddressUnsupported,
  tokenPrice,
  loadBalanceAndPrice: _loadBalanceAndPrice,
} = useBalance()

const { formMintData, mintWithErc20, approveTokenSpend } = useNftTokens()

const loadBalanceAndPrice = debounce(async () => {
  isLoading.value = true
  await _loadBalanceAndPrice(form.tokenAddress, TOKEN_TYPES.erc20)
  isLoading.value = false
}, 400)

const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    tokenAddress: { required, address },
  },
)

const isLoading = ref(false)
const promocodeRef = ref<ExposedPromocodeRef | null>(null)
const promocode = ref<Promocode | null>(null)

const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  return new BN(book.pricePerOneToken as BnLike, {
    decimals: tokenPrice.value.token.decimals,
  })
    .fromFraction(tokenPrice.value.token.decimals)
    .div(tokenPrice.value.price)
    .toString()
})

const isEnoughBalanceForBuy = computed(
  () => new BN(balance.value).compare(formattedTokenAmount.value) >= 0,
)

const submitFunc = async (editorInstance: UseImageEditor | null) => {
  if (
    !provider.value.selectedAddress ||
    !editorInstance ||
    !tokenPrice.value ||
    !isFormValid()
  )
    return

  formState.value = FORM_STATES.pending
  try {
    const banner = await editorInstance.canvasToFormData('Document')

    if (!banner) throw new Error('Failed to format canvas to FormData')

    const { buyParams, signature } = await formMintData({
      banner,
      book,
      account: provider.value.selectedAddress,
      chainId: Number(provider.value.chainId),
      tokenAddress: '',
      ...(promocode.value ? { promocodeId: promocode.value.id } : {}),
    })

    await approveTokenSpend(
      TOKEN_TYPES.erc20,
      new BN(formattedTokenAmount.value, {
        decimals: tokenPrice.value.token.decimals,
      })
        .toFraction(tokenPrice.value.token.decimals)
        .toString()
        .split('.')[0],
      form.tokenAddress,
    )

    await mintWithErc20(buyParams, signature)

    formState.value = FORM_STATES.success
  } catch (error) {
    ErrorHandler.process(error)
    formState.value = FORM_STATES.active
  }
}

// this submit function will be invoked on the top level of purchase form
submit.value = submitFunc
_isFormValid.value = () =>
  Boolean(promocodeRef.value?.isPromocodeValid()) &&
  isEnoughBalanceForBuy.value &&
  isFormValid()

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
</style>