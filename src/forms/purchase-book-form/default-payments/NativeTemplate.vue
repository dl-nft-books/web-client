<template>
  <template v-if="isPriceAndBalanceLoaded">
    <error-message
      v-if="isLoadFailed"
      :message="$t('native-template.loading-error-msg')"
    />
    <template v-else-if="tokenPrice">
      <readonly-field
        :label="$t('native-template.token-amount-lbl')"
        :value="formattedTokenAmount"
        :error-message="balanceError"
      />
      <promocode-template ref="promocodeRef" :book-id="book.id" />
    </template>
  </template>
  <loader v-else />

  <teleport to="#purchase-book-form__preview">
    <book-preview :book="book" />
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { BN, BnLike } from '@/utils/math.util'

import { ErrorMessage, Loader, BookPreview } from '@/common'
import { useBalance, useNftTokens, useFormValidation } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { ReadonlyField } from '@/fields'
import { ErrorHandler, safeInject } from '@/helpers'

import { PromocodeTemplate } from '@/forms/purchase-book-form'
import { ExposedPromocodeRef } from '@/forms/purchase-book-form/default-payments/PromocodeTemplate.vue'

import { Promocode, PurchaseFormKey } from '@/types'
import { FORM_STATES, TOKEN_TYPES } from '@/enums'
import { enoughBnAmount } from '@/validators'

import { UseImageEditor } from 'simple-fabric-vue-image-editor'

const TOKEN_AMOUNT_COEFFICIENT = 1.02

const {
  bookInfo: book,
  formState: { setFormState, enableForm },
  submit,
  isFormValid,
} = safeInject(PurchaseFormKey)

const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  tokenPrice,
  loadBalanceAndPrice,
} = useBalance()

const { mintWithEth, buildFormMintData } = useNftTokens()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  return new BN(book.pricePerOneToken as BnLike, {
    decimals: tokenPrice.value.token.decimals,
  })
    .fromFraction(tokenPrice.value.token.decimals)
    .div(tokenPrice.value.price)
    .toString()
})
const promocodeRef = ref<ExposedPromocodeRef | null>(null)
const promocode = ref<Promocode | null>(null)

const {
  isFormValid: isTemplateValid,
  touchField,
  getFieldErrorMessage,
} = useFormValidation(
  { balance },
  {
    balance: {
      enoughBnAmount: enoughBnAmount(formattedTokenAmount),
    },
  },
)

const balanceError = computed(() => getFieldErrorMessage('balance'))

const submitFunc = async (editorInstance: UseImageEditor | null) => {
  if (!provider.value.selectedAddress || !editorInstance || !tokenPrice.value)
    return

  setFormState(FORM_STATES.pending)
  try {
    const banner = await editorInstance.canvasToFormData('Document')

    if (!banner) throw new Error('Failed to format canvas to FormData')

    const { buyParams, signature } = await buildFormMintData({
      banner,
      book,
      account: provider.value.selectedAddress,
      chainId: Number(provider.value.chainId),
      tokenAddress: '',
      ...(promocode.value ? { promocodeId: promocode.value.id } : {}),
    })

    const nativeTokenAmount = new BN(book.pricePerOneToken as BnLike, {
      decimals: tokenPrice.value.token.decimals,
    })
      .div(tokenPrice.value.price)
      .mul(TOKEN_AMOUNT_COEFFICIENT)
      .toFixed()

    await mintWithEth(buyParams, signature, nativeTokenAmount)

    setFormState(FORM_STATES.success)
  } catch (error) {
    ErrorHandler.process(error)
    enableForm()
  }
}

// this submit function will be invoked on the top level of purchase form
submit.value = submitFunc
isFormValid.value = () =>
  Boolean(promocodeRef.value?.isPromocodeValid()) && isTemplateValid()

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
  async () => {
    await loadBalanceAndPrice('', TOKEN_TYPES.native)

    if (!tokenPrice.value) return

    touchField('balance')
  },
  { immediate: true },
)
</script>
