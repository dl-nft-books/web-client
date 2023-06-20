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

    <message-field v-else :title="$t('nft-template.loading-error-msg')" />
  </template>

  <template v-else-if="floorPrice">
    <readonly-field
      :label="$t('nft-template.collection-price')"
      :value="
        $t('nft-template.price', { price: formatAssetFromWei(floorPrice, 2) })
      "
      :error-message="floorPriceError"
    />

    <input-field
      v-if="!isLoadFailed && !floorPriceError"
      v-model="form.tokenId"
      type="number"
      :label="$t('nft-template.token-id-lbl')"
      :placeholder="$t('nft-template.token-id-placeholder')"
      :error-message="getFieldErrorMessage('tokenId')"
      :disabled="isFormDisabled"
      @blur="touchField('tokenId')"
    />
  </template>

  <loader v-if="isNftOwnershipLoading" />

  <message-field
    v-if="!isNftOwnedByUser || !isNftExist"
    :title="nftErrorMessage"
  />

  <checkbox-field
    v-model="form.isAgreedWithTerms"
    :label="$t('nft-template.buy-terms')"
  />

  <!-- This component is teleported to parent component (Purchase Form) -->
  <teleport to="#purchase-book-form__preview">
    <book-preview :book="book" modification="floor-price" />
  </teleport>
</template>

<script setup lang="ts">
import { UseImageEditor } from 'simple-fabric-vue-image-editor'
import { computed, reactive, watch, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash'

import { BN, BnLike } from '@/utils/math.util'

import {
  InputField,
  CheckboxField,
  ReadonlyField,
  MessageField,
} from '@/fields'

import { Loader, BookPreview } from '@/common'
import {
  useBalance,
  useFormValidation,
  useErc721,
  useNftTokens,
} from '@/composables'
import { PurchaseFormKey } from '@/types'
import { required, address, enoughBnAmount, truthyValue } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'
import { FORM_STATES, TOKEN_TYPES } from '@/enums'
import { ErrorHandler, formatAssetFromWei, safeInject } from '@/helpers'

const {
  bookInfo: book,
  formState: { isFormDisabled, formState, enableForm },
  isFormValid,
  submit,
} = safeInject(PurchaseFormKey)

const {
  isLoadFailed,
  isTokenAddressUnsupported,
  nftPrice,
  loadBalanceAndPrice: _loadBalanceAndPrice,
} = useBalance()

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const erc721 = useErc721()
const { buildFormMintData, mintWithNft, approveTokenSpend } = useNftTokens()

const form = reactive({
  tokenAddress: '',
  tokenId: '',
  isAgreedWithTerms: false,
})
const isCollectionPriceLoading = ref(false)
const isNftOwnershipLoading = ref(false)
const isNftOwnedByUser = ref(true)
const isNftExist = ref(true)

const floorPrice = computed(() => {
  if (!nftPrice.value) return ''

  return new BN(nftPrice.value.floor_price).toWei().toString()
})

const floorPriceError = computed(() =>
  getFieldErrorMessage('floorPrice') ? t('nft-template.not-enough-price') : '',
)

const nftErrorMessage = computed(() => {
  if (!isNftOwnedByUser.value) return t('nft-template.user-is-not-owner')

  if (!isNftExist.value) return t('nft-template.nft-not-exist')

  return ''
})

const {
  getFieldErrorMessage,
  touchField,
  isFormValid: isTemplateValid,
} = useFormValidation(
  { ...toRefs(form), floorPrice, isNftExist, isNftOwnedByUser },
  {
    tokenId: { required },
    tokenAddress: { required, address },
    isAgreedWithTerms: { truthyValue },
    floorPrice: {
      required,
      enoughBnAmount: enoughBnAmount(book.minNFTFloorPrice as BnLike),
    },
    isNftExist: { truthyValue },
    isNftOwnedByUser: { truthyValue },
  },
)

const loadBalanceAndPrice = debounce(async () => {
  isCollectionPriceLoading.value = true
  await _loadBalanceAndPrice(form.tokenAddress, TOKEN_TYPES.nft)
  isCollectionPriceLoading.value = false

  if (!nftPrice.value) return

  touchField('floorPrice')
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

  touchField('isNftExist')
  touchField('isNftOwnedByUser')

  isNftOwnershipLoading.value = false
}

const submitFunc = async (editorInstance: UseImageEditor | null) => {
  if (!editorInstance || !provider.value.selectedAddress) return

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
      nftId: form.tokenId,
    })

    await approveTokenSpend(
      TOKEN_TYPES.nft,
      undefined,
      form.tokenAddress,
      form.tokenId,
    )

    await mintWithNft(buyParams, signature)

    formState.value = FORM_STATES.success
  } catch (error) {
    ErrorHandler.process(error)
    enableForm()
  }
}

// this submit function will be invoked on the top level of purchase form
submit.value = submitFunc
isFormValid.value = isTemplateValid

watch(
  () => [form.tokenId, provider.value.selectedAddress],
  debounce(onTokenIdInput, 400),
)

watch(
  () => [provider.value.selectedAddress, form.tokenAddress],
  () => {
    nftPrice.value = null
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
</style>
