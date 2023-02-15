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

      <!-- PROMOCODES -->
      <input-field
        v-model="form.promocode"
        :label="$t('purchase-book-form.promocode-lbl')"
        :placeholder="$t('purchase-book-form.promocode-placeholder')"
        :error-message="getFieldErrorMessage('promocode')"
        :disabled="isFormDisabled"
        @blur="touchField('promocode')"
        @update:model-value="handlePromocodeInput"
      />

      <loader v-if="promocodeInfo.isLoading" />

      <template v-else>
        <message-field
          v-if="promocodeInfo.promocode"
          scheme="success"
          :icon="$icons.percentCircle"
          :title="
            $t('purchase-book-form.promocode-applied-msg', {
              amount: Number(promocodeInfo.promocode.discount) * 100,
            })
          "
        />
        <message-field
          v-if="promocodeInfo.error"
          :title="promocodeInfo.error"
        />
      </template>

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
import { computed, reactive, watch, toRef, Ref } from 'vue'
import { debounce } from 'lodash'
import { BN } from '@/utils/math.util'

import {
  InputField,
  TextareaField,
  ReadonlyField,
  MessageField,
} from '@/fields'

import { ErrorMessage, Loader, AppButton } from '@/common'
import { useBalance, usePromocode, useFormValidation } from '@/composables'
import { Platform, Promocode, TokenPrice } from '@/types'
import { BookRecord } from '@/records'

import { required, minLength, maxLength } from '@/validators'
import { PROMOCODE_LENGTH, MAX_FIELD_LENGTH } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  currentPlatform: Platform
  book: BookRecord
  isFormDisabled: boolean
}>()

const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  tokenPrice,
  getPrice,
  loadBalanceAndPrice,
} = useBalance(props.currentPlatform)

const { promocodeInfo, validatePromocode } = usePromocode()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const form = reactive({
  tokenAddress: '',
  signature: '',
  promocode: '',
})

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

const onPromocodeInput = async () => {
  await validatePromocode(form.promocode)

  //in order to always calculate new price based on initial price
  await getPrice(form.tokenAddress, false)

  if (!tokenPrice.value?.price || !promocodeInfo.promocode) return

  const newPrice = new BN(tokenPrice.value.price, {
    decimals: tokenPrice.value.token.decimals,
  })
    .div(1 - promocodeInfo.promocode.discount)
    .toString()

  tokenPrice.value.price = newPrice
}

const handlePromocodeInput = debounce(onPromocodeInput, 400)

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

defineExpose<{
  isFormValid: () => boolean
  tokenAddress: Ref<string>
  tokenPrice: Ref<TokenPrice | null>
  promocode: Ref<Promocode | null>
  signature: Ref<string>
  tokenAmount: Ref<string>
}>({
  isFormValid,
  tokenAmount: formattedTokenAmount,
  tokenPrice: tokenPrice,
  tokenAddress: toRef(form, 'tokenAddress'),
  signature: toRef(form, 'signature'),
  promocode: toRef(promocodeInfo, 'promocode'),
})

watch(
  () => provider.value.selectedAddress,
  () => {
    loadBalanceAndPrice(form.tokenAddress, false)
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
