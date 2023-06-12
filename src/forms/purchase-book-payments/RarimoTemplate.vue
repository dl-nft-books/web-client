<template>
  <loader v-if="isLoading" />
  <template v-else>
    <error-message
      v-if="isLoadFailed"
      :message="$t('rarimo-template.error-message')"
    />
    <select-field
      v-model="form.sourceChain"
      :value-options="sourceChainList"
      :placeholder="$t('rarimo-template.source-chain-placeholder')"
      :label="$t('rarimo-template.source-chain-lbl')"
      :error-message="getFieldErrorMessage('sourceChain')"
      :disabled="isFormDisabled || isGlobalFormDisabled"
      @blur="touchField('sourceChain')"
    />
    <loader v-if="isFetchingTokens" />
    <rarimo-token-select
      v-else-if="paymentTokensRaw.length"
      v-model="paymentToken"
      :value-options="paymentTokensRaw"
    />

    <loader v-if="isLoadingPrice" />

    <nft-checkout-info v-else-if="estimatedPrice" :info="estimatedPrice" />

    <message-field
      v-if="noAvailableTokens"
      :title="$t('rarimo-template.no-payment-tokens')"
    />
  </template>
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRef, watch, inject } from 'vue'

import {
  Loader,
  ErrorMessage,
  NftCheckoutInfo,
  RarimoTokenSelect,
} from '@/common'
import { MessageField, SelectField } from '@/fields'

import { BuyParams, FullBookInfo, PurchaseFormKey, Signature } from '@/types'
import {
  useBalance,
  useNftCheckout,
  useFormValidation,
  useForm,
} from '@/composables'

import { ErrorHandler } from '@/helpers'
import { BN, BnLike } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { ExposedFormRef } from '@/forms//PurchaseBookForm.vue'
import { TOKEN_TYPES } from '@/enums'
import { required } from '@/validators'
import {
  PaymentToken,
  BridgeChain,
  EstimatedPrice,
  ChainNames,
} from '@rarimo/nft-checkout'
import { config } from '@/config'
import { ethers } from 'ethers'
import { EstimatedPriceInfo } from '@/common/NftCheckoutInfo.vue'

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

const { isLoadFailed, tokenPrice, getPrice } = useBalance()

const {
  createCheckout,
  initCheckout,
  getSupportedChains,
  getSupportedTokens,
  getEstimatedPrice,
  performCheckout,
} = useNftCheckout()

const form = reactive({
  sourceChain: '',
  tokenAddress: '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    sourceChain: { required },
  },
)

const isDevelopment = config.DEPLOY_ENVIRONMENT === 'development'

const isLoading = ref(true)
const isLoadingPrice = ref(false)
const isFetchingTokens = ref(false)
const noAvailableTokens = ref(false)

const chainListRaw = ref<BridgeChain[]>([])
const paymentTokensRaw = ref<PaymentToken[]>([])
const paymentToken = ref<PaymentToken>()

const paymentTokensList = ref<SelectOption[]>([])
const sourceChainList = ref<SelectOption[]>([])

const estimatedPrice = ref<EstimatedPriceInfo>()

let priceRaw: EstimatedPrice | undefined = undefined

const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  return new BN(props.book.pricePerOneToken as BnLike, {
    decimals: tokenPrice.value.token.decimals,
  })
    .fromFraction(tokenPrice.value.token.decimals)
    .div(tokenPrice.value.price)
    .toString()
})

const initChainSelectFields = (supportedChains: BridgeChain[]) => {
  chainListRaw.value = supportedChains

  sourceChainList.value = supportedChains
    .filter(chain => (isDevelopment ? chain.isTestnet : !chain.isTestnet))
    .map(chain => ({
      label: chain.name,
      value: chain.name,
    }))
}

const initForm = async () => {
  try {
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

  const targetChain = isDevelopment
    ? chainListRaw.value.find(chain => chain.name === ChainNames.Sepolia)
    : chainListRaw.value.find(chain => chain.name === ChainNames.Polygon)

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
    value: token.address || ethers.constants.AddressZero,
  }))
}

const initializeEstimatedPrice = async () => {
  if (!paymentToken.value) return

  const price = await getEstimatedPrice(paymentToken.value)

  if (!price) return

  priceRaw = price

  estimatedPrice.value = {
    gasPrice: price.gasPrice!,
    impact: price.impact!,
    balance: (price.from as unknown as { balance: string }).balance,
    price: {
      value: price.price.value,
      decimals: price.price.decimals,
      symbol: price.price.symbol,
    },
    initialPrice: {
      value: formattedTokenAmount.value,
      symbol: price.to.chain.token.symbol,
    },
  }
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

  await initCheckout(sourceChain, targetChain, {
    recipient: provider.value.selectedAddress,
    nftPrice,
  })
}

const _performCheckout = async (
  buyParams: BuyParams,
  signature: Signature,
  amountOfEth: string,
) => {
  if (!estimatedPrice.value || !priceRaw) return

  await performCheckout(priceRaw, {
    buyParams,
    signature,
    amountOfEth,
  })
}

defineExpose<Omit<ExposedFormRef, 'promocode'>>({
  isFormValid: () =>
    !noAvailableTokens.value &&
    !isFormDisabled.value &&
    Boolean(paymentToken.value) &&
    isFormValid(),
  tokenAddress: toRef(form, 'tokenAddress'),
  tokenAmount: formattedTokenAmount,
  tokenPrice,
  mintFunction: _performCheckout,
})

watch(paymentToken, async () => {
  if (!paymentToken.value) return

  isLoadingPrice.value = true
  disableForm()
  try {
    await initializeEstimatedPrice()
  } catch (error) {
    ErrorHandler.process(error)
  }
  isLoadingPrice.value = false
  enableForm()
})

watch(
  () => form.sourceChain,
  async () => {
    if (!form.sourceChain) return

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

    await getPrice('', TOKEN_TYPES.native, Number(config.DEFAULT_CHAIN_ID))
    await initForm()
    isLoading.value = false
  },
  { immediate: true },
)
</script>
