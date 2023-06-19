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
      />
      <p
        v-if="!isEnoughBalanceForBuy"
        class="native-template__not-enough-balance-msg"
      >
        {{ $t('native-template.not-enough-balance-msg') }}
      </p>

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
import { useBalance, useNftTokens } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { ReadonlyField } from '@/fields'
import { ErrorHandler, safeInject } from '@/helpers'

import { PromocodeTemplate } from '@/forms/purchase-book-form'
import { ExposedPromocodeRef } from '@/forms/purchase-book-form/default-payments/PromocodeTemplate.vue'

import { Promocode, PurchaseFormKey } from '@/types'
import { FORM_STATES, TOKEN_TYPES } from '@/enums'

import { UseImageEditor } from 'simple-fabric-vue-image-editor'

const TOKEN_AMOUNT_COEFFICIENT = 1.02
// FIXME: figure out the way to validate modular form
const {
  bookInfo: book,
  formState,
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

const { mintWithEth, formMintData } = useNftTokens()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

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
  if (!provider.value.selectedAddress || !editorInstance || !tokenPrice.value)
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

    const nativeTokenAmount = new BN(book.pricePerOneToken as BnLike, {
      decimals: tokenPrice.value.token.decimals,
    })
      .div(tokenPrice.value.price)
      .mul(TOKEN_AMOUNT_COEFFICIENT)
      .toFixed()

    await mintWithEth(buyParams, signature, nativeTokenAmount)

    formState.value = FORM_STATES.success
  } catch (error) {
    ErrorHandler.process(error)
    formState.value = FORM_STATES.active
  }
}

// this submit function will be invoked on the top level of purchase form
submit.value = submitFunc
isFormValid.value = () =>
  Boolean(promocodeRef.value?.isPromocodeValid()) && isEnoughBalanceForBuy.value

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
    loadBalanceAndPrice('', TOKEN_TYPES.native)
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
</style>
