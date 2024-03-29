<template>
  <!-- PROMOCODES -->
  <input-field
    v-model="form.promocode"
    :label="$t('promocode-template.promocode-lbl')"
    :placeholder="$t('promocode-template.promocode-placeholder')"
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
        $t('promocode-template.promocode-applied-msg', {
          amount: Number(promocodeInfo.promocode.discount) * 100,
        })
      "
    />
    <message-field v-if="promocodeInfo.error" :title="promocodeInfo.error" />
  </template>
</template>

<script setup lang="ts">
import { reactive, Ref, toRef } from 'vue'
import { debounce } from 'lodash'

import { InputField, MessageField } from '@/fields'
import { Loader } from '@/common'
import { useFormValidation, usePromocode } from '@/composables'
import { maxLength, minLength, urlSymbols } from '@/validators'
import { MAX_PROMOCODE_LENGTH, MIN_PROMOCODE_LENGTH } from '@/const'
import { Promocode, PurchaseFormKey } from '@/types'
import { TOKEN_TYPES } from '@/enums'
import { safeInject } from '@/helpers'

export type ExposedPromocodeRef = {
  isPromocodeValid: () => boolean
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

const {
  formState: { isFormDisabled },
} = safeInject(PurchaseFormKey)

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

const onPromocodeInput = async () => {
  if (!isPromocodeValid()) return

  await validatePromocode(form.promocode, Number(props.bookId))
}

const handlePromocodeInput = debounce(onPromocodeInput, 400)

defineExpose<ExposedPromocodeRef>({
  isPromocodeValid: () => isPromocodeValid() && !promocodeInfo.error,
  promocode: toRef(promocodeInfo, 'promocode'),
})
</script>

<style scoped lang="scss"></style>
