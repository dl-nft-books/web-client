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
    <div class="purchase-book-form__body-preview">
      <div class="purchase-book-form__body-preview-img-wrp">
        <img
          class="purchase-book-form__body-preview-img"
          :src="book.bannerUrl"
          :alt="book.title"
        />
      </div>
      <div class="purchase-book-form__body-preview-details">
        <h4 class="purchase-book-form__body-preview-title">
          {{ book.title }}
        </h4>
        <span class="purchase-book-form__body-preview-price">
          {{ formatFiatAssetFromWei(book.price, 'USD') }}
        </span>
      </div>
    </div>

    <select-field
      class="purchase-book-form__select"
      v-model="form.tokenType"
      :label="$t('purchase-book-form.token-type-lbl')"
      :value-options="tokenTypesOptions"
      :error-message="getFieldErrorMessage('tokenType')"
      :disabled="isFormDisabled"
      @blur="touchField('tokenType')"
    />
    <input-field
      v-if="isTokenAddressRequired"
      class="purchase-book-form__input"
      v-model="form.tokenAddress"
      :label="$t('purchase-book-form.token-address-lbl')"
      :error-message="getFieldErrorMessage('tokenAddress')"
      :disabled="isFormDisabled"
      @blur="touchField('tokenAddress')"
    />

    <template v-if="isPriceAndBalanceLoaded">
      <template v-if="isLoadFailed">
        <template v-if="isTokenAddressUnsupported">
          <div class="purchase-book-form__address-error">
            <icon
              class="purchase-book-form__address-error-icon"
              :name="$icons.exclamationCircle"
            />
            <div>
              <p class="purchase-book-form__address-error-message">
                {{ $t('purchase-book-form.unsupported-token-msg-1') }}
              </p>
              <p class="purchase-book-form__address-error-message">
                {{ $t('purchase-book-form.unsupported-token-msg-2') }}
              </p>
            </div>
          </div>
        </template>
        <template v-else>
          <error-message
            :message="$t('purchase-book-form.loading-error-msg')"
          />
        </template>
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
          class="purchase-book-form__textarea"
          v-model="form.signature"
          :maxlength="MAX_SIGNATURE_LENGTH"
          :label="$t('purchase-book-form.signature-lbl')"
          :error-message="getFieldErrorMessage('signature')"
          :disabled="isFormDisabled"
          @blur="touchField('signature')"
        />
        <app-button
          class="purchase-book-form__purchase-btn"
          :text="$t('purchase-book-form.purchase-btn')"
          size="small"
          :disabled="isFormDisabled || !isEnoughBalanceForBuy"
          @click="submit"
        />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </template>
</template>

<script lang="ts" setup>
import { AppButton, Loader, ErrorMessage, Animation, Icon } from '@/common'
import { InputField, TextareaField, SelectField, ReadonlyField } from '@/fields'

import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { BookRecord } from '@/records'
import {
  ErrorHandler,
  formatFiatAssetFromWei,
  createNewTask,
  getPriceByPlatform,
  getMintSignature,
  untilTaskFinishedGeneration,
} from '@/helpers'
import { ref, reactive, computed, watch } from 'vue'
import {
  useForm,
  useFormValidation,
  useNftBookToken,
  useErc20,
} from '@/composables'
import { required, requiredIf, address } from '@/validators'
import { BN } from '@/utils/math.util'
import { errors } from '@/api/json-api/errors'
import { ethers } from 'ethers'
import { TokenPriceResponse, Platform } from '@/types'

import loaderAnimation from '@/assets/animations/loader.json'

enum TOKEN_TYPES {
  native = 'Native',
  erc20 = 'ERC-20',
}

const MAX_SIGNATURE_LENGTH = 64
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const TOKEN_AMOUNT_COEFFICIENT = 1.02

const props = defineProps<{
  book: BookRecord
  currentPlatform: Platform
}>()

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'submitting', value: boolean): void
}>()

const isPriceAndBalanceLoaded = ref(false)
const tokenPrice = ref<TokenPriceResponse | null>(null)
const isTokenAddressUnsupported = ref(false)
const isLoadFailed = ref(false)
const balance = ref('')

const { provider } = storeToRefs(useWeb3ProvidersStore())
const nftBookToken = useNftBookToken(provider.value, props.book.contractAddress)
const erc20 = useErc20(provider.value)

const form = reactive({
  tokenAddress: '',
  signature: '',
  tokenType: TOKEN_TYPES.native,
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
  })),
)

const tokenTypesOptions = computed(() => [
  TOKEN_TYPES.native,
  TOKEN_TYPES.erc20,
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
    const currentTask = await createNewTask({
      signature: form.signature,
      account: provider.value.selectedAddress,
      bookId: props.book.id,
    })
    const generatedTask = await untilTaskFinishedGeneration(currentTask.id)

    const mintSignature = await getMintSignature(
      props.currentPlatform.id,
      generatedTask!.id,
      isTokenAddressRequired.value ? form.tokenAddress : '',
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
      isTokenAddressRequired.value ? form.tokenAddress : ZERO_ADDRESS,
      mintSignature.price,
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

async function getPrice() {
  try {
    const contract = isTokenAddressRequired.value ? form.tokenAddress : ''
    tokenPrice.value = await getPriceByPlatform(
      props.currentPlatform.id,
      contract,
    )
  } catch (e) {
    if (e instanceof errors.NotFoundError) {
      isTokenAddressUnsupported.value = true
    }
    throw e
  }
}

const getBalance = async () => {
  if (isTokenAddressRequired.value) {
    erc20.init(form.tokenAddress)
    await erc20.getDecimals()
    const blnc = await erc20.getBalanceOf(provider.value.selectedAddress!)
    balance.value = new BN(blnc).fromFraction(erc20.decimals.value).toString()
  } else {
    const blnc = await provider.value.getBalance(
      provider.value.selectedAddress!,
    )
    balance.value = new BN(blnc).fromWei().toString()
  }
}

const loadBalanceAndPrice = async () => {
  tokenPrice.value = null
  balance.value = ''
  isLoadFailed.value = false

  if (
    isTokenAddressRequired.value &&
    !ethers.utils.isAddress(form.tokenAddress)
  )
    return

  isPriceAndBalanceLoaded.value = false
  isTokenAddressUnsupported.value = false

  try {
    await Promise.all([getPrice(), getBalance()])
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }

  isPriceAndBalanceLoaded.value = true
}

watch(
  () => [form.tokenType, form.tokenAddress, provider.value.selectedAddress],
  () => loadBalanceAndPrice(),
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.purchase-book-form__body-preview {
  display: flex;
  width: 100%;
  gap: toRem(20);
  padding-bottom: toRem(24);
  margin-bottom: toRem(24);
  border-bottom: toRem(1) solid var(--border-primary-main);

  @include respond-to(small) {
    padding-bottom: toRem(15);
    margin-bottom: toRem(15);
  }
}

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

.purchase-book-form__body-preview-img-wrp {
  filter: drop-shadow(0 toRem(4) toRem(8) rgba(150, 150, 157, 0.25));
  max-width: toRem(120);
  max-height: toRem(120);
}

.purchase-book-form__body-preview-img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
  filter: var(--cover-image-shadow-small);
}

.purchase-book-form__body-preview-details {
  display: flex;
  flex-direction: column;
}

.purchase-book-form__body-preview-title {
  text-transform: uppercase;
  font-size: toRem(18);
  line-height: 1.2;
  font-weight: 600;
}

.purchase-book-form__body-preview-price {
  text-transform: uppercase;
  margin-top: auto;
  font-size: toRem(22);
  line-height: 1.2;
  font-weight: 900;
  color: var(--primary-main);
}

.purchase-book-form__select {
  margin-bottom: toRem(16);
}

.purchase-book-form__input {
  margin-bottom: toRem(16);
}

.purchase-book-form__address-error {
  display: flex;
  gap: toRem(10);
  width: 100%;
  background: var(--background-error);
  border-radius: toRem(4);
  padding: toRem(12) toRem(10);
}

.purchase-book-form__address-error-icon {
  width: toRem(15);
  height: toRem(15);
  color: var(--error-main);
}

.purchase-book-form__address-error-message {
  font-size: toRem(14);
  line-height: 1.2;
  color: var(--error-main);
}

.purchase-book-form__not-enough-balance-msg {
  font-size: toRem(12);
  text-align: left;
  width: 100%;
  color: var(--error-main);
}

.purchase-book-form__textarea {
  margin: toRem(16) 0 toRem(36);
}

.purchase-book-form__purchase-btn {
  margin: 0 auto;
  min-width: toRem(144);
}
</style>
