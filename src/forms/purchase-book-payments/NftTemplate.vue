<template>
  <input-field
    v-model="form.tokenAddress"
    :label="$t('nft-template.token-address-lbl')"
    :placeholder="$t('nft-template.token-address-placeholder')"
    :error-message="getFieldErrorMessage('tokenAddress')"
    :disabled="isFormDisabled"
    @blur="touchField('tokenAddress')"
  />

  <loader v-if="isLoading" />

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
    v-if="!isLoadFailed"
    v-model="form.tokenId"
    :label="$t('nft-template.token-id-lbl')"
    :placeholder="$t('nft-template.token-id-placeholder')"
    :error-message="getFieldErrorMessage('tokenId')"
    :disabled="isFormDisabled"
    @blur="touchField('tokenId')"
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
    :disabled="
      isFormDisabled || !form.isAgreedWithTerms || !isFloorPriceAcceptable
    "
  />
</template>

<script setup lang="ts">
import { computed, reactive, watch, toRef, ref, inject } from 'vue'
import { storeToRefs } from 'pinia'

import { BN } from '@/utils/math.util'

import {
  TextareaField,
  InputField,
  CheckboxField,
  ReadonlyField,
  MessageField,
} from '@/fields'

import { ErrorMessage, Loader, AppButton } from '@/common'
import { useBalance, useFormValidation } from '@/composables'
import { PurchaseFormKey } from '@/types'
import { BookRecord } from '@/records'

import { required, address } from '@/validators'
import { MAX_FIELD_LENGTH } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { TOKEN_TYPES } from '@/enums'
import { debounce } from 'lodash'
import { formatAssetFromWei } from '@/helpers'

const props = defineProps<{
  book: BookRecord
}>()

const { platform: currentPlatform, isFormDisabled } = inject(PurchaseFormKey)

const {
  isLoadFailed,
  isTokenAddressUnsupported,
  nftPrice,
  loadBalanceAndPrice: _loadBalanceAndPrice,
} = useBalance(currentPlatform)

const loadBalanceAndPrice = debounce(async () => {
  isLoading.value = true
  await _loadBalanceAndPrice(form.tokenAddress, TOKEN_TYPES.nft)
  isLoading.value = false
}, 400)

const { provider } = storeToRefs(useWeb3ProvidersStore())

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

const isLoading = ref(false)

const isFloorPriceAcceptable = computed(() => {
  const formattedBookFloorPrice = formatAssetFromWei(props.book.floorPrice, 2)

  return new BN(nftPrice.value?.usd).compare(formattedBookFloorPrice) >= 1
})

defineExpose<Omit<ExposedFormRef, 'promocode' | 'tokenAmount' | 'tokenPrice'>>({
  isFormValid: () => isFormValid(),
  tokenAddress: toRef(form, 'tokenAddress'),
  signature: toRef(form, 'signature'),
  tokenId: toRef(form, 'tokenId'),
})

watch(
  () => [provider.value.selectedAddress, form.tokenAddress],
  () => {
    loadBalanceAndPrice()
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
