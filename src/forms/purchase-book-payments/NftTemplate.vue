<template>
  <input-field
    v-model="form.tokenAddress"
    :label="$t('nft-template.token-address-lbl')"
    :placeholder="$t('nft-template.token-address-placeholder')"
    :error-message="getFieldErrorMessage('tokenAddress')"
    :disabled="isFormDisabled"
    @blur="touchField('tokenAddress')"
  />

  <loader v-if="isCollectionPriceLoading" />

  <template v-else-if="isLoadFailed">
    <message-field
      v-if="isTokenAddressUnsupported"
      :title="$t('nft-template.unsupported-token-title')"
      :subtitle="$t('nft-template.unsupported-token-subtitle')"
    />

    <error-message v-else :message="$t('nft-template.loading-error-msg')" />
  </template>

  <template v-else-if="nftPrice">
    <readonly-field
      :label="$t('nft-template.collection-price')"
      :value="$t('nft-template.price', { price: nftPrice.usd })"
    />

    <p
      v-if="!isFloorPriceAcceptable"
      class="nft-template__not-enough-balance-msg"
    >
      {{ $t('nft-template.not-enough-price') }}
    </p>
  </template>

  <input-field
    v-if="!isLoadFailed && isFloorPriceAcceptable"
    v-model="form.tokenId"
    :label="$t('nft-template.token-id-lbl')"
    :placeholder="$t('nft-template.token-id-placeholder')"
    :error-message="getFieldErrorMessage('tokenId')"
    :disabled="isFormDisabled"
    @blur="touchField('tokenId')"
  />

  <loader v-if="isNftOwnershipLoading" />

  <message-field
    v-if="!isNftOwnedByUser || !isNftExist"
    :title="nftErrorMessage"
  />

  <textarea-field
    v-model="form.signature"
    :placeholder="$t('purchase-book-form.signature-placeholder')"
    :maxlength="MAX_FIELD_LENGTH.signature"
    :label="$t('purchase-book-form.signature-lbl')"
    :error-message="getFieldErrorMessage('signature')"
    :disabled="isFormDisabled"
    @blur="touchField('signature')"
  />

  <checkbox-field
    v-model="form.isAgreedWithTerms"
    :label="$t('nft-template.buy-terms')"
  />

  <!-- Starting NFT generation -->
  <app-button
    class="nft-template__purchase-btn"
    size="small"
    type="submit"
    :text="$t('purchase-book-form.generate-btn')"
    :disabled="isGenerateButtonDisabled"
  />
</template>

<script setup lang="ts">
import { computed, reactive, watch, toRef, ref, inject } from 'vue'

import { BN } from '@/utils/math.util'

import {
  TextareaField,
  InputField,
  CheckboxField,
  ReadonlyField,
  MessageField,
} from '@/fields'

import { ErrorMessage, Loader, AppButton } from '@/common'
import { useBalance, useFormValidation, useErc721 } from '@/composables'
import { Book, PurchaseFormKey } from '@/types'

import { required, address } from '@/validators'
import { MAX_FIELD_LENGTH } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { TOKEN_TYPES } from '@/enums'
import { debounce } from 'lodash'
import { ErrorHandler, formatAssetFromWei } from '@/helpers'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  book: Book
}>()

const { platform: currentPlatform, isFormDisabled } = inject(PurchaseFormKey)

const {
  isLoadFailed,
  isTokenAddressUnsupported,
  nftPrice,
  loadBalanceAndPrice: _loadBalanceAndPrice,
} = useBalance(currentPlatform)

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const erc721 = useErc721()

const form = reactive({
  tokenAddress: '',
  tokenId: '',
  signature: '',
  isAgreedWithTerms: false,
})

const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    signature: { required },
    tokenId: { required },
    tokenAddress: { required, address },
  },
)

const isCollectionPriceLoading = ref(false)
const isNftOwnershipLoading = ref(false)
const isNftOwnedByUser = ref(true)
const isNftExist = ref(true)

const isGenerateButtonDisabled = computed(() => {
  return (
    isFormDisabled.value ||
    !form.isAgreedWithTerms ||
    !isFloorPriceAcceptable.value ||
    !isNftOwnedByUser.value ||
    !isNftExist.value
  )
})

const nftErrorMessage = computed(() => {
  if (!isNftOwnedByUser.value) return t('nft-template.user-is-not-owner')

  if (!isNftExist.value) return t('nft-template.nft-not-exist')

  return ''
})

const isFloorPriceAcceptable = computed(() => {
  const formattedBookFloorPrice = formatAssetFromWei(props.book.floor_price, 2)

  return new BN(nftPrice.value?.usd).compare(formattedBookFloorPrice) >= 1
})

const loadBalanceAndPrice = debounce(async () => {
  isCollectionPriceLoading.value = true
  await _loadBalanceAndPrice(form.tokenAddress, TOKEN_TYPES.nft)
  isCollectionPriceLoading.value = false
}, 400)

const onTokenIdInput = async () => {
  if (!form.tokenAddress || !form.tokenId) return
  try {
    isNftOwnershipLoading.value = true
    isNftExist.value = true
    isNftOwnedByUser.value = true

    erc721.init(form.tokenAddress)

    const owner = await erc721.getOwner(form.tokenId)

    if (owner !== provider.value.selectedAddress) isNftOwnedByUser.value = false
  } catch (error) {
    isNftExist.value = false
    ErrorHandler.processWithoutFeedback(error)
  }

  isNftOwnershipLoading.value = false
}

defineExpose<Omit<ExposedFormRef, 'promocode' | 'tokenAmount' | 'tokenPrice'>>({
  isFormValid,
  tokenAddress: toRef(form, 'tokenAddress'),
  signature: toRef(form, 'signature'),
  tokenId: toRef(form, 'tokenId'),
})

watch(
  () => [form.tokenId, provider.value.selectedAddress],
  debounce(onTokenIdInput, 400),
)

watch(
  () => [provider.value.selectedAddress, form.tokenAddress],
  () => {
    loadBalanceAndPrice()
    form.tokenId = ''
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.nft-template__not-enough-balance-msg {
  font-size: toRem(12);
  text-align: left;
  width: 100%;
  color: var(--error-main);
}

.nft-template__purchase-btn {
  margin-inline: auto;
  margin-top: toRem(20);
  min-width: toRem(144);
  min-height: toRem(48);
}
</style>
