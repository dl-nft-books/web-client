<template>
  <div class="default-payment-flow">
    <select-field
      v-model="form.tokenType"
      :label="$t('default-payment-flow.token-type-lbl')"
      :value-options="tokenTypesOptions"
      :disabled="isFormDisabled"
    />

    <component :is="paymentTemplate" ref="paymentTemplateRef" />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

import { SelectField } from '@/fields'
import { globalizeTokenType, safeInject } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { FORM_STATES, Q_CHAINS, TOKEN_TYPES } from '@/enums'
import { PurchaseFormKey } from '@/types'
import {
  NativeTemplate,
  Erc20Template,
  VoucherTemplate,
  NftTemplate,
} from '@/forms/purchase-book-form'

const { bookInfo: book, formState } = safeInject(PurchaseFormKey)

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const isFormDisabled = computed(() => formState.value === FORM_STATES.disabled)

const form = reactive({
  tokenType: TOKEN_TYPES.native,
})

const paymentTemplate = computed(() => {
  switch (form.tokenType) {
    case TOKEN_TYPES.erc20:
      return Erc20Template
    case TOKEN_TYPES.voucher:
      return VoucherTemplate
    case TOKEN_TYPES.nft:
      return NftTemplate
    case TOKEN_TYPES.native:
    default:
      return NativeTemplate
  }
})

const tokenTypesOptions = computed(() => {
  const defaultOptions = [
    {
      label: globalizeTokenType(TOKEN_TYPES.native),
      value: TOKEN_TYPES.native,
    },
  ]

  /* 
    Temporary solution because of missing price for Q on backend
    Will be fixed in future updates
  */
  if (
    provider.value.chainId !== Number(Q_CHAINS.mainet) &&
    provider.value.chainId !== Number(Q_CHAINS.testnet)
  ) {
    defaultOptions.push({
      label: globalizeTokenType(TOKEN_TYPES.erc20),
      value: TOKEN_TYPES.erc20,
    })
  }

  if (book.isVoucherBuyable) {
    defaultOptions.push({
      label: globalizeTokenType(TOKEN_TYPES.voucher),
      value: TOKEN_TYPES.voucher,
    })
  }

  if (book.isNFTBuyable) {
    defaultOptions.push({
      label: globalizeTokenType(TOKEN_TYPES.nft),
      value: TOKEN_TYPES.nft,
    })
  }

  return defaultOptions
})
</script>

<style lang="scss" scoped>
.default-payment-flow {
  all: inherit;
}
</style>
