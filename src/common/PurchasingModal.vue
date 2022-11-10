<script lang="ts" setup>
import { AppButton, Modal, Loader, ErrorMessage, Animation } from '@/common'
import { InputField, TextareaField, SelectField, ReadonlyField } from '@/fields'

import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { BookRecord } from '@/records'
import {
  ErrorHandler,
  formatFiatAssetFromWei,
  createNewTask,
  getPlatformsList,
  getPriceByPlatform,
  getMintSignature,
  untilTaskFinishedGeneration, Bus,
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
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'
import { TokenPriceResponse } from '@/types'

import loaderAnimation from '@/assets/animations/loader.json'
import disableChainAnimation from '@/assets/animations/disable-chain.json'

enum TOKEN_TYPES {
  native = 'Native',
  erc20 = 'ERC-20',
}

const MAX_SIGNATURE_LENGTH = 64
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const TOKEN_AMOUNT_COEFFICIENT = 1.02

const props = defineProps<{
  isShown: boolean
  book: BookRecord
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
  (event: 'submit'): void
}>()

const { t } = useI18n()

const isLoaded = ref(false)
const isPriceLoaded = ref(true)
const currentPlatform = ref()
const tokenPrice = ref<TokenPriceResponse | null>(null)
const isTokenAddressUnsupported = ref(false)
const isPriceError = ref(false)

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
const isValidChain = computed(
  () => currentPlatform.value?.chain_identifier === provider.value.chainId,
)
const priceErrorMessage = computed(() => {
  if (!isPriceError.value && isLoaded) return ''
  return isTokenAddressUnsupported.value
    ? t('purchasing-modal.unsupported-token-msg')
    : t('purchasing-modal.loading-error-msg')
})
const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  // FIXME: fix decimals hardcode
  return new BN(props.book.price, { decimals: tokenPrice.value.token.decimals })
    .fromWei()
    .div(tokenPrice.value.price)
    .toFixed(tokenPrice.value.token.decimals)
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

const title = computed(() => {
  if (!isValidChain.value) return t('purchasing-modal.wrong-network-title')
  return isFormDisabled.value
    ? t('purchasing-modal.generation-title')
    : t('purchasing-modal.title')
})
const tokenTypesOptions = computed(() => [
  TOKEN_TYPES.native,
  TOKEN_TYPES.erc20,
])

const submit = async () => {
  if (!isFormValid() || !provider.value.selectedAddress || !tokenPrice.value)
    return

  disableForm()

  try {
    const currentTask = await createNewTask({
      signature: form.signature,
      account: provider.value.selectedAddress,
      bookId: props.book.id,
    })
    const generatedTask = await untilTaskFinishedGeneration(currentTask.id)

    if (!generatedTask) return

    const mintSignature = await getMintSignature(
      currentPlatform.value.id,
      generatedTask.id,
      isTokenAddressRequired.value ? form.tokenAddress : '',
    )

    const nativeToken = isTokenAddressRequired.value
      ? ''
      : new BN(props.book.price, { decimals: tokenPrice.value.token.decimals })
          .div(tokenPrice.value.price)
          .mul(TOKEN_AMOUNT_COEFFICIENT)
          .toFixed()
          .toString()

    if (isTokenAddressRequired.value) {
      erc20.init(form.tokenAddress)
      await erc20.getAllowance(
        provider.value.selectedAddress,
        props.book.contractAddress,
      )
      if (erc20.allowance) {
        const allowanceBN = new BN(erc20.allowance.value)
        const tokenPriceAmount = new BN(formattedTokenAmount.value).toFraction(
          tokenPrice.value.token.decimals,
        )

        if (allowanceBN.compare(tokenPriceAmount) === -1) {
          const maxAmount = new BN(2).pow(256).sub(1).toString()
          const tx = await erc20.approve(props.book.contractAddress, maxAmount)
          await tx?.wait()
        }
      }
    }

    await nftBookToken.mintToken(
      isTokenAddressRequired.value ? form.tokenAddress : ZERO_ADDRESS,
      mintSignature.price,
      mintSignature.end_timestamp,
      generatedTask.metadata_ipfs_hash,
      mintSignature.signature.r,
      mintSignature.signature.s,
      mintSignature.signature.v,
      nativeToken,
    )

    emit('submit')
  } catch (e) {
    Bus.error('purchasing-modal.transaction-problem')
    ErrorHandler.processWithoutFeedback(e)
  }
  enableForm()
}

async function init() {
  isLoaded.value = false
  try {
    const platforms = await getPlatformsList()

    // FIXME: fix platforms hardcode
    currentPlatform.value = platforms.find(i => i.id === 'ethereum')
    await getPrice()
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

async function getPrice() {
  tokenPrice.value = null
  if (
    !currentPlatform.value ||
    (isTokenAddressRequired.value && !ethers.utils.isAddress(form.tokenAddress))
  )
    return

  isPriceLoaded.value = false
  isPriceError.value = false
  isTokenAddressUnsupported.value = false
  try {
    const contract = isTokenAddressRequired.value ? form.tokenAddress : ''
    tokenPrice.value = await getPriceByPlatform(
      currentPlatform.value.id,
      contract,
    )
  } catch (e) {
    if (e instanceof errors.NotFoundError) {
      isTokenAddressUnsupported.value = true
    }
    isPriceError.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isPriceLoaded.value = true
}

watch(
  () => [form.tokenType, form.tokenAddress],
  () => getPrice(),
)

init()
</script>

<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="value => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="purchasing-modal__pane">
        <div class="purchasing-modal__head">
          <h3 class="purchasing-modal__head-title">
            {{ title }}
          </h3>
          <app-button
            v-if="!isFormDisabled"
            class="purchasing-modal__close-btn"
            :icon-right="$icons.x"
            color="default"
            scheme="default"
            size="x-small"
            @click="modal.close"
          />
        </div>
        <div class="purchasing-modal__body">
          <template v-if="!isValidChain && isLoaded">
            <div class="purchasing-modal__submitting-animation-wrp">
              <animation
                class="purchasing-modal__submitting-animation"
                :animation-data="disableChainAnimation"
                :loop="true"
                :speed="1"
              />
            </div>
            <span class="purchasing-modal__submitting-message">
              {{ $t('purchasing-modal.wrong-network-message') }}
            </span>
          </template>
          <template v-else>
            <template v-if="isFormDisabled">
              <div class="purchasing-modal__submitting-animation-wrp">
                <animation
                  class="purchasing-modal__submitting-animation"
                  :animation-data="loaderAnimation"
                  :loop="true"
                  :speed="1"
                />
              </div>
              <h4 class="purchasing-modal__submitting-title">
                {{ $t('purchasing-modal.submitting-title') }}
              </h4>
              <span class="purchasing-modal__submitting-message">
                {{ $t('purchasing-modal.submitting-message') }}
              </span>
            </template>
            <template v-else>
              <div class="purchasing-modal__body-preview">
                <div class="purchasing-modal__body-preview-img-wrp">
                  <img
                    class="purchasing-modal__body-preview-img"
                    :src="book.bannerUrl"
                    :alt="book.title"
                  />
                </div>
                <div class="purchasing-modal__body-preview-details">
                  <h4 class="purchasing-modal__body-preview-title">
                    {{ book.title }}
                  </h4>
                  <span class="purchasing-modal__body-preview-price">
                    {{ formatFiatAssetFromWei(book.price, 'USD') }}
                  </span>
                </div>
              </div>

              <select-field
                class="purchasing-modal__select"
                v-model="form.tokenType"
                :label="$t('purchasing-modal.token-type-lbl')"
                :value-options="tokenTypesOptions"
                :error-message="getFieldErrorMessage('tokenType')"
                :disabled="isFormDisabled"
                @blur="touchField('tokenType')"
              />
              <input-field
                v-if="isTokenAddressRequired"
                class="purchasing-modal__input"
                v-model="form.tokenAddress"
                :label="$t('purchasing-modal.token-address-lbl')"
                :error-message="getFieldErrorMessage('tokenAddress')"
                :disabled="isFormDisabled"
                @blur="touchField('tokenAddress')"
              />

              <template v-if="isPriceLoaded">
                <template v-if="priceErrorMessage">
                  <error-message :message="priceErrorMessage" />
                </template>
                <template v-else-if="tokenPrice">
                  <readonly-field
                    class="purchasing-modal__readonly"
                    :label="$t('purchasing-modal.token-amount-lbl')"
                    :value="formattedTokenAmount"
                  />
                  <textarea-field
                    class="purchasing-modal__textarea"
                    v-model="form.signature"
                    :maxlength="MAX_SIGNATURE_LENGTH"
                    :label="$t('purchasing-modal.signature-lbl')"
                    :error-message="getFieldErrorMessage('signature')"
                    :disabled="isFormDisabled"
                    @blur="touchField('signature')"
                  />
                  <app-button
                    class="purchasing-modal__purchase-btn"
                    :text="$t('purchasing-modal.purchase-btn')"
                    size="small"
                    :disabled="isFormDisabled"
                    @click="submit"
                  />
                </template>
              </template>
              <template v-else>
                <loader />
              </template>
            </template>
          </template>
        </div>
      </div>
    </template>
  </modal>
</template>

<style lang="scss" scoped>
.purchasing-modal__pane {
  display: flex;
  flex-direction: column;
  max-width: toRem(460);
  max-height: 100vh;
  padding: toRem(32);
  background: var(--background-primary);
  border-radius: toRem(10);
  min-width: toRem(460);

  @include respond-to(small) {
    min-width: 100%;
  }
}

.purchasing-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: toRem(36);

  @include respond-to(small) {
    margin-bottom: toRem(20);
  }
}

.purchasing-modal__head-title {
  font-size: toRem(24);
  line-height: 1.2;
  font-weight: 600;
}

.purchasing-modal__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.purchasing-modal__body-preview {
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

.purchasing-modal__submitting-animation-wrp {
  margin: 0 auto toRem(30);
  max-width: toRem(240);
}

.purchasing-modal__submitting-title {
  margin-bottom: toRem(16);
  font-size: toRem(18);
  line-height: 1.2;
  font-weight: 600;
  text-align: center;
}

.purchasing-modal__submitting-message {
  max-width: toRem(310);
  font-size: toRem(18);
  line-height: 1.2;
  text-align: center;
}

.purchasing-modal__body-preview-img-wrp {
  filter: drop-shadow(0 toRem(4) toRem(8) rgba(150, 150, 157, 0.25));
  max-width: toRem(120);
  max-height: toRem(120);
}

.purchasing-modal__body-preview-img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

.purchasing-modal__body-preview-details {
  display: flex;
  flex-direction: column;
}

.purchasing-modal__body-preview-over-title {
  font-size: toRem(14);
  line-height: 1.2;
  margin-bottom: toRem(6);
}

.purchasing-modal__body-preview-title {
  text-transform: uppercase;
  font-size: toRem(18);
  line-height: 1.2;
  font-weight: 600;
}

.purchasing-modal__body-preview-price {
  text-transform: uppercase;
  margin-top: auto;
  font-size: toRem(22);
  line-height: 1.2;
  font-weight: 900;
  color: var(--primary-main);
}

.purchasing-modal__select {
  margin-bottom: toRem(16);
}

.purchasing-modal__input {
  margin-bottom: toRem(16);
}

.purchasing-modal__readonly {
  margin-bottom: toRem(16);
}

.purchasing-modal__textarea {
  margin-bottom: toRem(36);
}

.purchasing-modal__purchase-btn {
  margin: 0 auto;
  min-width: toRem(144);
}
</style>
