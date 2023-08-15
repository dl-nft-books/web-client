<template>
  <template v-if="isPriceAndBalanceLoaded">
    <error-message
      v-if="isLoadFailed"
      :message="$t('native-template.loading-error-msg')"
    />
    <template v-else-if="formattedTokenAmount">
      <readonly-field
        :key="formattedTokenAmount"
        :label="$t('native-template.token-amount-lbl')"
        :value="formattedTokenAmount"
        :error-message="balanceError"
      />
      <promocode-template ref="promocodeRef" :book-id="book.id" />
    </template>
  </template>
  <loader v-else />

  <!-- This component is teleported to parent component (Purchase Form) -->
  <mounted-teleport to="#purchase-book-form__preview">
    <book-preview :book="book" />
  </mounted-teleport>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { BN } from '@distributedlab/tools'

import { ErrorMessage, Loader, BookPreview, MountedTeleport } from '@/common'
import { useBalance, useNftTokens, useFormValidation } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { ReadonlyField } from '@/fields'
import { ErrorHandler, calcFormattedTokenAmount, safeInject } from '@/helpers'

import { PromocodeTemplate } from '@/forms/purchase-book-form'
import { ExposedPromocodeRef } from '@/forms/purchase-book-form/default-payments/PromocodeTemplate.vue'

import { Promocode, PurchaseFormKey } from '@/types'
import { FORM_STATES, TOKEN_TYPES } from '@/enums'
import { enoughBnAmount } from '@/validators'

import { UseImageEditor } from 'simple-fabric-vue-image-editor'

const TOKEN_AMOUNT_COEFFICIENT = 1.02

const {
  bookInfo: book,
  formState: { formState, enableForm },
  submit,
  isFormValid,
} = safeInject(PurchaseFormKey)

const promocodeRef = ref<ExposedPromocodeRef | null>(null)
const promocode = ref<Promocode | null>(null)
const formattedTokenAmount = ref('')

const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  tokenPrice,
  loadBalanceAndPrice,
  getPrice,
} = useBalance()

const { mintWithEth, buildFormMintData } = useNftTokens()

const web3ProvidersStore = useWeb3ProvidersStore()

const provider = computed(() => web3ProvidersStore.provider)

const balanceError = computed(() => getFieldErrorMessage('balance'))

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

const submitFunc = async (editorInstance: UseImageEditor | null) => {
  if (!provider.value.address || !editorInstance || !tokenPrice.value) return

  formState.value = FORM_STATES.pending
  try {
    const banner = await editorInstance.canvasToFormData('Document')

    if (!banner) throw new Error('Failed to format canvas to FormData')

    const { buyParams, signature } = await buildFormMintData({
      banner,
      book,
      account: provider.value.address,
      chainId: Number(provider.value.chainId),
      tokenAddress: '',
      ...(promocode.value ? { promocodeId: promocode.value.id } : {}),
    })

    const discount = promocode.value?.discount ?? 0

    const nativeTokenAmount = BN.fromBigInt(book.pricePerOneToken)
      .div(BN.fromRaw(tokenPrice.value.price, tokenPrice.value.token.decimals))
      .mul(BN.fromRaw(TOKEN_AMOUNT_COEFFICIENT))
      .mul(BN.fromRaw(1 - discount)).value

    await mintWithEth(buyParams, signature, nativeTokenAmount)

    formState.value = FORM_STATES.success
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
  () => promocodeRef.value?.promocode,
  async () => {
    if (!promocodeRef.value) return

    promocode.value = promocodeRef.value.promocode

    await getPrice('', TOKEN_TYPES.native)

    formattedTokenAmount.value = calcFormattedTokenAmount(
      tokenPrice.value,
      book.pricePerOneToken,
      promocode.value?.discount ?? 0,
    )
  },
)

watch(
  () => provider.value.address,
  async () => {
    await loadBalanceAndPrice('', TOKEN_TYPES.native)

    if (!tokenPrice.value) return

    formattedTokenAmount.value = calcFormattedTokenAmount(
      tokenPrice.value,
      book.pricePerOneToken,
    )

    touchField('balance')
  },
  { immediate: true },
)
</script>
