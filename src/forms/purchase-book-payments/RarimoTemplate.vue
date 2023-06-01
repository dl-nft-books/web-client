<template>
  <template v-if="!isLoading">
    <error-message
      v-if="isLoadFailed"
      :message="$t('rarimo-template.error-message')"
    />

    <template v-else-if="isPriceAndBalanceLoaded">
      <select-field
        v-model="form.sourceChain"
        :value-options="sourceChainList"
        :placeholder="$t('rarimo-template.source-chain-placeholder')"
        :label="$t('rarimo-template.source-chain-lbl')"
        :error-message="getFieldErrorMessage('sourceChain')"
        :disabled="isFormDisabled || isGlobalFormDisabled"
        @blur="touchField('sourceChain')"
      />
      <select-field
        v-model="form.targetChain"
        :value-options="targetChainList"
        :placeholder="$t('rarimo-template.target-chain-placeholder')"
        :label="$t('rarimo-template.target-chain-lbl')"
        :error-message="getFieldErrorMessage('targetChain')"
        :disabled="isFormDisabled || isGlobalFormDisabled"
        @blur="touchField('targetChain')"
      />
      <loader v-if="isFetchingTokens" />
      <select-field
        v-else-if="paymentTokensList.length"
        v-model="form.paymentToken"
        :value-options="paymentTokensList"
        :label="$t('rarimo-template.payment-token-lbl')"
        :placeholder="$t('rarimo-template.payment-token-placeholder')"
        :error-message="getFieldErrorMessage('paymentToken')"
        :disabled="isFormDisabled || isGlobalFormDisabled"
        @blur="touchField('paymentToken')"
      />
      <readonly-field
        v-if="estimatedPrice"
        :value="
          formatAssetFromWei(
            estimatedPrice.price.value,
            estimatedPrice.price.decimals,
          )
        "
        :label="$t('rarimo-template.estimated-price-lbl')"
      />

      <message-field
        v-if="noAvailableTokens"
        :title="$t('rarimo-template.no-payment-tokens')"
      />
    </template>
  </template>
  <loader v-else />
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRef, watch, inject } from 'vue'

import { Loader, ErrorMessage } from '@/common'
import { MessageField, SelectField, ReadonlyField } from '@/fields'

import { BuyParams, FullBookInfo, PurchaseFormKey, Signature } from '@/types'
import {
  useBalance,
  useNftCheckout,
  useFormValidation,
  useForm,
} from '@/composables'

import { ErrorHandler, formatAssetFromWei } from '@/helpers'
import { BN, BnLike } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { TOKEN_TYPES } from '@/enums'
import { required } from '@/validators'
import { PaymentToken, BridgeChain, EstimatedPrice } from '@rarimo/nft-checkout'

type SelectOption = {
  label: string
  value: string
}

const TOKEN_AMOUNT_COEFFICIENT = 1.02

const props = defineProps<{
  book: FullBookInfo
}>()

const { isFormDisabled: isGlobalFormDisabled } = inject(PurchaseFormKey)

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const {
  balance,
  isLoadFailed,
  isPriceAndBalanceLoaded,
  tokenPrice,
  loadBalanceAndPrice,
} = useBalance()

const {
  createCheckout,
  initCheckout,
  getSupportedChains,
  getSupportedTokens,
  getEstimatedPrice,
  sendTransaction,
} = useNftCheckout()

const form = reactive({
  sourceChain: '',
  targetChain: '',
  paymentToken: '',
  tokenAddress: '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    sourceChain: { required },
    targetChain: { required },
    paymentToken: { required },
  },
)

const isLoading = ref(true)
const isFetchingTokens = ref(false)
const noAvailableTokens = ref(false)

const chainListRaw = ref<BridgeChain[]>([])
const paymentTokensRaw = ref<PaymentToken[]>([])

const paymentTokensList = ref<SelectOption[]>([])
const sourceChainList = ref<SelectOption[]>([])
const targetChainList = ref<SelectOption[]>([])

const estimatedPrice = ref<EstimatedPrice>()

const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  return new BN(props.book.pricePerOneToken as BnLike, {
    decimals: tokenPrice.value.token.decimals,
  })
    .fromFraction(tokenPrice.value.token.decimals)
    .div(tokenPrice.value.price)
    .toString()
})

const isEnoughBalanceForBuy = computed(() =>
  estimatedPrice.value
    ? new BN(balance.value).compare(estimatedPrice.value.price.value) >= 0
    : false,
)

const initChainSelectFields = (supportedChains: BridgeChain[]) => {
  chainListRaw.value = supportedChains

  sourceChainList.value = supportedChains.map(chain => ({
    label: chain.name,
    value: chain.name,
  }))

  targetChainList.value = supportedChains
    .filter(chain =>
      props.book.networks.find(
        network => network.attributes.chain_id === chain.id,
      ),
    )
    .map(chain => ({
      label: chain.name,
      value: chain.name,
    }))
}

const initForm = async () => {
  try {
    // console.log('creating checkout')

    await createCheckout()

    const supportedChains = await getSupportedChains()

    if (!supportedChains) throw new Error('no supported chains')

    initChainSelectFields(supportedChains)
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const getBridgeChains = () => {
  const sourceChain = chainListRaw.value.find(
    chain => chain.name === form.sourceChain,
  )

  if (!sourceChain) return

  const targetChain = chainListRaw.value.find(
    chain => chain.name === form.targetChain,
  )

  if (!targetChain) return

  return {
    sourceChain,
    targetChain,
  }
}

const initializeSupportedTokens = async (sourceChain: BridgeChain) => {
  const tokens = await getSupportedTokens(sourceChain)

  if (!tokens?.length) throw new Error('no payment tokens')

  paymentTokensRaw.value = tokens
  paymentTokensList.value = tokens.map(token => ({
    label: `${token.name}: ${token.balance}`,
    value: token.address,
  }))
}

const initializeCheckout = async (
  sourceChain: BridgeChain,
  targetChain: BridgeChain,
) => {
  if (!tokenPrice.value || !provider.value.selectedAddress) return

  const nftPrice = new BN(props.book.pricePerOneToken as BnLike, {
    decimals: tokenPrice.value?.token.decimals,
  })
    .div(tokenPrice.value.price)
    .mul(TOKEN_AMOUNT_COEFFICIENT)
    .toFixed()

  // console.log(sourceChain, targetChain, nftPrice)

  await initCheckout(sourceChain, targetChain, {
    recipient: provider.value.selectedAddress,
    nftPrice,
  })
}

const performCheckout = async (
  buyParams: BuyParams,
  signature: Signature,
  amountOfEth: string,
) => {
  if (!estimatedPrice.value) return

  await sendTransaction(estimatedPrice.value, {
    buyParams,
    signature,
    amountOfEth,
  })
}

defineExpose<Omit<ExposedFormRef, 'promocode'>>({
  isFormValid: () =>
    !noAvailableTokens.value && isEnoughBalanceForBuy.value && isFormValid(),
  tokenAddress: toRef(form, 'tokenAddress'),
  tokenAmount: formattedTokenAmount,
  tokenPrice,
  mintFunction: performCheckout,
})

watch(
  () => form.paymentToken,
  async () => {
    if (!form.paymentToken) return
    const paymentToken = paymentTokensRaw.value.find(
      token => token.address === form.paymentToken,
    )
    if (!paymentToken) return

    const price = await getEstimatedPrice(paymentToken as PaymentToken)

    if (!price) return

    estimatedPrice.value = price
  },
)

watch(
  () => [form.sourceChain, form.targetChain],
  async () => {
    if (!form.sourceChain || !form.targetChain) return

    // console.log('initializing checkout and fetching token list')

    noAvailableTokens.value = false
    isFetchingTokens.value = true

    disableForm()
    try {
      const bridgeChains = getBridgeChains()
      if (!bridgeChains) return

      await initializeCheckout(
        bridgeChains.sourceChain,
        bridgeChains.targetChain,
      )
      await initializeSupportedTokens(bridgeChains.sourceChain)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      noAvailableTokens.value = true
    }
    enableForm()

    isFetchingTokens.value = false
  },
)

watch(
  () => provider.value.selectedAddress,
  async () => {
    isLoading.value = true
    await loadBalanceAndPrice('', TOKEN_TYPES.native)
    await initForm()
    isLoading.value = false
  },
  { immediate: true },
)
</script>
