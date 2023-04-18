<template>
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
    <message-field v-if="promocodeInfo.error" :title="promocodeInfo.error" />
  </template>
</template>

<script setup lang="ts">
import { reactive, Ref, toRef, inject } from 'vue'
import { debounce } from 'lodash'

import { InputField, MessageField } from '@/fields'
import { Loader } from '@/common'
import { useFormValidation, usePromocode, useBalance } from '@/composables'
import { maxLength, minLength, urlSymbols } from '@/validators'
import { MAX_PROMOCODE_LENGTH, MIN_PROMOCODE_LENGTH } from '@/const'
import { Promocode, TokenPrice, PurchaseFormKey } from '@/types'
import { BN } from '@/utils/math.util'
import { TOKEN_TYPES } from '@/enums'

export type ExposedPromocodeRef = {
  isPromocodeValid: () => boolean
  tokenPrice: Ref<TokenPrice | null>
  promocode: Ref<Promocode | null>
}

const props = withDefaults(
  defineProps<{
    tokenAddress?: string
    tokenType?: TOKEN_TYPES
    bookId: string
  }>(),
  {
    tokenAddress: '',
    tokenType: TOKEN_TYPES.native,
  },
)

const { platform: currentPlatform, isFormDisabled } = inject(PurchaseFormKey)

const form = reactive({
  promocode: '',
})

const {
  getFieldErrorMessage,
  touchField,
  isFormValid: isPromocodeValid,
} = useFormValidation(form, {
  promocode: {
    minLength: minLength(MIN_PROMOCODE_LENGTH),
    maxLength: maxLength(MAX_PROMOCODE_LENGTH),
    urlSymbols,
  },
})

const { promocodeInfo, validatePromocode } = usePromocode()
const { getPrice, tokenPrice } = useBalance(currentPlatform)

const onPromocodeInput = async () => {
  if (!isPromocodeValid()) return

  await validatePromocode(form.promocode, Number(props.bookId))

  //in order to always calculate new price based on initial price
  await getPrice(props.tokenAddress, props.tokenType)

  if (!tokenPrice.value?.price || !promocodeInfo.promocode) return

  const newPrice = new BN(tokenPrice.value.price, {
    decimals: tokenPrice.value.token.decimals,
  })
    .div(1 - promocodeInfo.promocode.discount)
    .toString()

  tokenPrice.value.price = newPrice
}

const handlePromocodeInput = debounce(onPromocodeInput, 400)

defineExpose<ExposedPromocodeRef>({
  isPromocodeValid,
  tokenPrice,
  promocode: toRef(promocodeInfo, 'promocode'),
})
</script>

<style scoped lang="scss"></style>
