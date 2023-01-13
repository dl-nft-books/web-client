<template>
  <template v-if="isFormDisabled">
    <div class="purchase-book-form__submitting-animation-wrp">
      <animation
        class="purchase-book-form__submitting-animation"
        :animation-data="loaderAnimation"
        :loop="true"
        :speed="1"
      />
    </div>
    <h4 class="purchase-book-form__submitting-title">
      {{ $t('purchase-book-form.submitting-title') }}
    </h4>
    <span class="purchase-book-form__submitting-message">
      {{ $t('purchase-book-form.submitting-message') }}
    </span>
  </template>
  <template v-else>
    <book-preview :book="book" />

    <select-field
      v-model="form.tokenType"
      class="purchase-book-form__select"
      :label="$t('purchase-book-form.token-type-lbl')"
      :value-options="tokenTypesOptions"
      :error-message="getFieldErrorMessage('tokenType')"
      :disabled="isFormDisabled"
      @blur="touchField('tokenType')"
    />
    <input-field
      v-if="isTokenAddressRequired"
      v-model="form.tokenAddress"
      class="purchase-book-form__input"
      :label="$t('purchase-book-form.token-address-lbl')"
      :error-message="getFieldErrorMessage('tokenAddress')"
      :disabled="isFormDisabled"
      @blur="touchField('tokenAddress')"
    />

    <template v-if="isPriceAndBalanceLoaded">
      <template v-if="isLoadFailed">
        <message-field
          v-if="isTokenAddressUnsupported"
          :title="$t('purchase-book-form.unsupported-token-msg-1')"
          :subtitle="$t('purchase-book-form.unsupported-token-msg-2')"
        />

        <error-message
          v-else
          :message="$t('purchase-book-form.loading-error-msg')"
        />
      </template>
      <template v-else-if="tokenPrice">
        <readonly-field
          class="purchase-book-form__readonly"
          :label="$t('purchase-book-form.token-amount-lbl')"
          :value="formattedTokenAmount"
        />
        <p
          v-if="!isEnoughBalanceForBuy"
          class="purchase-book-form__not-enough-balance-msg"
        >
          {{ $t('purchase-book-form.not-enough-balance-msg') }}
        </p>
        <textarea-field
          v-model="form.signature"
          class="purchase-book-form__textarea"
          :placeholder="$t('purchase-book-form.signature-placeholder')"
          :maxlength="MAX_FIELD_LENGTH.signature"
          :label="$t('purchase-book-form.signature-lbl')"
          :error-message="getFieldErrorMessage('signature')"
          :disabled="isFormDisabled"
          @blur="touchField('signature')"
        />

        <input-field
          v-model="form.promocode"
          class="purchase-book-form__input"
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
        <app-button
          class="purchase-book-form__purchase-btn"
          size="small"
          :text="$t('purchase-book-form.generate-btn')"
          :disabled="isFormDisabled || !isEnoughBalanceForBuy"
          @click="submit"
        />
      </template>
    </template>
    <loader v-else />
  </template>
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { BN } from '@/utils/math.util'

import { createNewTask, getMintSignature } from '@/api'

import { MAX_FIELD_LENGTH, NULL_ADDRESS, PROMOCODE_LENGTH } from '@/const'
import { Platform } from '@/types'
import { TOKEN_TYPES } from '@/enums'
import { BookRecord } from '@/records'

import {
  AppButton,
  Loader,
  ErrorMessage,
  Animation,
  BookPreview,
} from '@/common'

import {
  useForm,
  useFormValidation,
  useNftBookToken,
  useErc20,
  usePromocode,
  useBalance,
} from '@/composables'

import {
  InputField,
  TextareaField,
  SelectField,
  ReadonlyField,
  MessageField,
} from '@/fields'
import {
  ErrorHandler,
  untilTaskFinishedGeneration,
  globalizeTokenType,
} from '@/helpers'

import {
  required,
  requiredIf,
  address,
  minLength,
  maxLength,
} from '@/validators'

import loaderAnimation from '@/assets/animations/loader.json'

const TOKEN_AMOUNT_COEFFICIENT = 1.02

const props = defineProps<{
  book: BookRecord
  currentPlatform: Platform
}>()

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'submitting', value: boolean): void
}>()

const {
  isPriceAndBalanceLoaded,
  tokenPrice,
  isTokenAddressUnsupported,
  isLoadFailed,
  balance,
  getPrice,
  loadBalanceAndPrice,
} = useBalance(props.currentPlatform)

const { promocodeInfo, validatePromocode } = usePromocode()

const { provider } = storeToRefs(useWeb3ProvidersStore())
const nftBookToken = useNftBookToken(provider.value, props.book.contractAddress)
const erc20 = useErc20(provider.value)

const form = reactive({
  tokenAddress: '',
  signature: '',
  tokenType: TOKEN_TYPES.native,
  promocode: '',
})

const isTokenAddressRequired = computed(
  () => form.tokenType !== TOKEN_TYPES.native,
)
const isEnoughBalanceForBuy = computed(
  () => new BN(balance.value).compare(formattedTokenAmount.value) >= 0,
)

const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  return new BN(props.book.price, { decimals: tokenPrice.value.token.decimals })
    .fromFraction(tokenPrice.value.token.decimals)
    .div(tokenPrice.value.price)
    .toString()
})

const { disableForm, enableForm, isFormDisabled } = useForm()
const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  computed(() => ({
    signature: { required },
    tokenType: { required },
    tokenAddress: {
      requiredIf: requiredIf(isTokenAddressRequired),
      ...(isTokenAddressRequired.value ? { address } : {}),
    },
    promocode: {
      minLength: minLength(PROMOCODE_LENGTH),
      maxLength: maxLength(PROMOCODE_LENGTH),
    },
  })),
)

const tokenTypesOptions = computed(() => [
  {
    label: globalizeTokenType(TOKEN_TYPES.native),
    value: TOKEN_TYPES.native,
  },
  {
    label: globalizeTokenType(TOKEN_TYPES.erc20),
    value: TOKEN_TYPES.erc20,
  },
])

const submit = async () => {
  if (
    !isFormValid() ||
    !provider.value.selectedAddress ||
    !tokenPrice.value ||
    !isEnoughBalanceForBuy.value
  )
    return

  disableForm()
  emit('submitting', true)
  try {
    const { data: currentTask } = await createNewTask({
      signature: form.signature,
      account: provider.value.selectedAddress,
      bookId: props.book.id,
    })
    const generatedTask = await untilTaskFinishedGeneration(currentTask.id)

    const { data: mintSignature } = await getMintSignature(
      props.currentPlatform.id,
      generatedTask!.id,
      isTokenAddressRequired.value ? form.tokenAddress : '',
      promocodeInfo.promocode ? promocodeInfo.promocode.id : undefined,
    )

    const nativeTokenAmount = isTokenAddressRequired.value
      ? ''
      : new BN(props.book.price, { decimals: tokenPrice.value.token.decimals })
          .div(tokenPrice.value.price)
          .mul(TOKEN_AMOUNT_COEFFICIENT)
          .toFixed()
          .toString()

    if (isTokenAddressRequired.value) {
      erc20.init(form.tokenAddress)
      await erc20.approveSpend(
        provider.value.selectedAddress,
        formattedTokenAmount.value,
        props.book.contractAddress,
      )
    }

    await nftBookToken.mintToken(
      isTokenAddressRequired.value ? form.tokenAddress : NULL_ADDRESS,
      mintSignature.price,
      mintSignature.discount,
      mintSignature.end_timestamp,
      generatedTask!.metadata_ipfs_hash,
      mintSignature.signature.r,
      mintSignature.signature.s,
      mintSignature.signature.v,
      nativeTokenAmount,
    )
    emit('submitting', false)
    emit('submit')
  } catch (e) {
    ErrorHandler.process(e)
  }
  enableForm()
}

const onPromocodeInput = async () => {
  await validatePromocode(form.promocode)

  //in order to always calculate new price based on initial price
  await getPrice(form.tokenAddress)

  if (!tokenPrice.value?.price || !promocodeInfo.promocode) return

  const newPrice = new BN(tokenPrice.value.price, {
    decimals: tokenPrice.value.token.decimals,
  })
    .div(1 - promocodeInfo.promocode.discount)
    .toString()

  tokenPrice.value.price = newPrice
}

const handlePromocodeInput = debounce(onPromocodeInput, 400)

watch(
  () => [form.tokenType, form.tokenAddress, provider.value.selectedAddress],
  () => loadBalanceAndPrice(isTokenAddressRequired.value, form.tokenAddress),
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.purchase-book-form__submitting-animation-wrp {
  margin: 0 auto toRem(30);
  max-width: toRem(240);
}

.purchase-book-form__submitting-title {
  margin-bottom: toRem(16);
  font-size: toRem(18);
  line-height: 1.2;
  font-weight: 600;
  text-align: center;
}

.purchase-book-form__submitting-message {
  max-width: toRem(310);
  font-size: toRem(18);
  line-height: 1.2;
  text-align: center;
}

.purchase-book-form__not-enough-balance-msg {
  font-size: toRem(12);
  text-align: left;
  width: 100%;
  color: var(--error-main);
}

.purchase-book-form__purchase-btn {
  margin: 0 auto;
  min-width: toRem(144);
  min-height: toRem(48);
}
</style>
