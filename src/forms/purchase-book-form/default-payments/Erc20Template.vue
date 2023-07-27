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
        :key="formattedTokenAmount"
        :label="$t('erc20-template.token-amount-lbl')"
        :value="formattedTokenAmount"
        :error-message="balanceError"
      />

      <promocode-template
        ref="promocodeRef"
        :book-id="book.id"
        :token-type="TOKEN_TYPES.erc20"
        :token-address="form.tokenAddress"
      />
    </template>
  </template>

  <!-- This component is teleported to parent component (Purchase Form) -->
  <mounted-teleport to="#purchase-book-form__preview">
    <book-preview :book="book" />
  </mounted-teleport>
</template>

<script setup lang="ts">
import { UseImageEditor } from 'simple-fabric-vue-image-editor'
import { reactive, ref, computed, watch, toRefs } from 'vue'
import { debounce } from 'lodash'

import { Loader, ErrorMessage, BookPreview, MountedTeleport } from '@/common'
import { PromocodeTemplate } from '@/forms/purchase-book-form'
import { InputField, MessageField, ReadonlyField } from '@/fields'
import { useFormValidation, useBalance, useNftTokens } from '@/composables'
import { required, address, enoughBnAmount } from '@/validators'

import { Promocode, PurchaseFormKey } from '@/types'
import { ExposedPromocodeRef } from '@/forms/purchase-book-form/default-payments/PromocodeTemplate.vue'
import { BN } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { FORM_STATES, TOKEN_TYPES } from '@/enums'
import { ErrorHandler, calcFormattedTokenAmount, safeInject } from '@/helpers'

const {
  bookInfo: book,
  formState: { isFormDisabled, enableForm, formState },
  submit,
  isFormValid: _isFormValid,
} = safeInject(PurchaseFormKey)

const form = reactive({
  tokenAddress: '',
})

const isLoading = ref(false)
const promocodeRef = ref<ExposedPromocodeRef | null>(null)
const promocode = ref<Promocode | null>(null)
const formattedTokenAmount = ref('')

const web3ProvidersStore = useWeb3ProvidersStore()
const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  isTokenAddressUnsupported,
  tokenPrice,
  loadBalanceAndPrice: _loadBalanceAndPrice,
  getPrice,
} = useBalance()

const { buildFormMintData, mintWithErc20, approveTokenSpend } = useNftTokens()

const provider = computed(() => web3ProvidersStore.provider)
const balanceError = computed(() => getFieldErrorMessage('balance'))

const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  { ...toRefs(form), balance },
  {
    tokenAddress: { required, address },
    balance: { enoughBnAmount: enoughBnAmount(formattedTokenAmount) },
  },
)

const loadBalanceAndPrice = debounce(async () => {
  if (!isFormValid()) return

  isLoading.value = true
  await _loadBalanceAndPrice(form.tokenAddress, TOKEN_TYPES.erc20)

  if (!tokenPrice.value) return

  formattedTokenAmount.value = calcFormattedTokenAmount(
    tokenPrice.value,
    book.pricePerOneToken,
  )

  touchField('balance')

  isLoading.value = false
}, 400)

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

    const { buyParams, signature } = await buildFormMintData({
      banner,
      book,
      account: provider.value.selectedAddress,
      chainId: Number(provider.value.chainId),
      tokenAddress: form.tokenAddress,
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
    enableForm()
  }
}

// this submit function will be invoked on the top level of purchase form
submit.value = submitFunc
_isFormValid.value = () =>
  Boolean(promocodeRef.value?.isPromocodeValid()) && isFormValid()

watch(
  () => promocodeRef.value?.promocode,
  async () => {
    if (!promocodeRef.value) return

    promocode.value = promocodeRef.value.promocode

    await getPrice(form.tokenAddress, TOKEN_TYPES.erc20)

    formattedTokenAmount.value = calcFormattedTokenAmount(
      tokenPrice.value,
      book.pricePerOneToken,
      promocode.value?.discount ?? 0,
    )
  },
)

watch(
  () => [form.tokenAddress, provider.value.selectedAddress],
  () => {
    if (!form.tokenAddress) return

    loadBalanceAndPrice()
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
