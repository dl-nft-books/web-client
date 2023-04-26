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

  <template v-else-if="nftPrice">
    <readonly-field
      :label="$t('nft-template.collection-price')"
      :value="$t('nft-template.price', { price: nftPrice.floor_price })"
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

  <checkbox-field
    v-model="form.isAgreedWithTerms"
    :label="$t('nft-template.buy-terms')"
  />
</template>

<script setup lang="ts">
import { computed, reactive, watch, toRef, ref, inject } from 'vue'

import { BN } from '@/utils/math.util'

import {
  InputField,
  CheckboxField,
  ReadonlyField,
  MessageField,
} from '@/fields'

import { Loader } from '@/common'
import {
  useBalance,
  useFormValidation,
  useErc721,
  FullBookInfo,
} from '@/composables'
import { PurchaseFormKey } from '@/types'

import { required, address } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { TOKEN_TYPES } from '@/enums'
import { debounce } from 'lodash'
import { ErrorHandler, formatAssetFromWei } from '@/helpers'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  book: FullBookInfo
}>()

const { isFormDisabled } = inject(PurchaseFormKey)

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

const form = reactive({
  tokenAddress: '',
  tokenId: '',
  signature: '',
  isAgreedWithTerms: false,
})

const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
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
  const formattedBookFloorPrice = formatAssetFromWei(
    props.book.minNFTFloorPrice,
    2,
  )

  return (
    new BN(nftPrice.value?.floor_price).compare(formattedBookFloorPrice) >= 1
  )
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
  isFormValid: () => !isGenerateButtonDisabled.value && isFormValid(),
  tokenAddress: toRef(form, 'tokenAddress'),
  tokenId: toRef(form, 'tokenId'),
})

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
