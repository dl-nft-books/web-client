<template>
  <template v-if="isPriceAndBalanceLoaded">
    <error-message
      v-if="isLoadFailed"
      :message="$t('purchase-book-form.loading-error-msg')"
    />
    <template v-else-if="tokenPrice">
      <readonly-field
        :label="$t('purchase-book-form.token-amount-lbl')"
        :value="formattedTokenAmount"
      />
      <p
        v-if="!isEnoughBalanceForBuy"
        class="native-template__not-enough-balance-msg"
      >
        {{ $t('purchase-book-form.not-enough-balance-msg') }}
      </p>

      <promocode-template ref="promocodeRef" />
    </template>
  </template>
  <loader v-else />
</template>

<script setup lang="ts">
import { computed, reactive, watch, toRef, ref, inject } from 'vue'

import { BN } from '@/utils/math.util'

import { ReadonlyField } from '@/fields'

import { ErrorMessage, Loader } from '@/common'
import { useBalance } from '@/composables'
import { PromocodeTemplate } from '@/forms/purchase-book-payments'
import { Promocode, PurchaseFormKey, FullBookInfo } from '@/types'

import { useWeb3ProvidersStore } from '@/store'
import { ExposedPromocodeRef } from '@/forms/purchase-book-payments/PromocodeTemplate.vue'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { TOKEN_TYPES } from '@/enums'

const props = defineProps<{
  book: FullBookInfo
}>()

const { platform: currentPlatform } = inject(PurchaseFormKey)

const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  tokenPrice,
  loadBalanceAndPrice,
} = useBalance(currentPlatform)

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const form = reactive({
  tokenAddress: '',
  signature: '',
})

const promocodeRef = ref<ExposedPromocodeRef | null>(null)
const promocode = ref<Promocode | null>(null)

const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  return new BN(props.book.pricePerOneToken, {
    decimals: tokenPrice.value.token.decimals,
  })
    .fromFraction(tokenPrice.value.token.decimals)
    .div(tokenPrice.value.price)
    .toString()
})

const isEnoughBalanceForBuy = computed(
  () => new BN(balance.value).compare(formattedTokenAmount.value) >= 0,
)

defineExpose<ExposedFormRef>({
  isFormValid: () =>
    promocodeRef.value?.isPromocodeValid() && isEnoughBalanceForBuy.value,
  tokenAmount: formattedTokenAmount,
  tokenPrice: tokenPrice,
  tokenAddress: toRef(form, 'tokenAddress'),
  promocode,
})

watch(
  () => promocodeRef.value?.tokenPrice,
  () => {
    if (!promocodeRef.value?.tokenPrice) return

    promocode.value = promocodeRef.value.promocode
    tokenPrice.value = promocodeRef.value.tokenPrice
  },
)

watch(
  () => provider.value.selectedAddress,
  () => {
    loadBalanceAndPrice(form.tokenAddress, TOKEN_TYPES.native)
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.native-template__not-enough-balance-msg {
  font-size: toRem(12);
  text-align: left;
  width: 100%;
  color: var(--error-main);
}
</style>
