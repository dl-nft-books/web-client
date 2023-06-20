<template>
  <div class="rarimo-flow">
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
        :disabled="isFormDisabled"
        @blur="touchField('sourceChain')"
      />
      <loader v-if="isFetchingTokens" />
      <rarimo-token-select
        v-else-if="paymentTokensRaw.length"
        v-model="form.paymentToken"
        :value-options="paymentTokensRaw"
      />

      <loader v-if="isLoadingPrice" />

      <nft-checkout-info v-else-if="estimatedPrice" :info="estimatedPrice" />

      <message-field
        v-if="noAvailableTokens"
        :title="$t('rarimo-template.no-payment-tokens')"
      />
    </template>

    <!-- This component is teleported to parent component (Purchase Form) -->
    <teleport to="#purchase-book-form__preview">
      <book-preview :book="book" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, toRefs } from 'vue'

import {
  Loader,
  ErrorMessage,
  NftCheckoutInfo,
  RarimoTokenSelect,
  BookPreview,
} from '@/common'
import { MessageField, SelectField } from '@/fields'

import { PurchaseFormKey } from '@/types'
import {
  useBalance,
  useNftCheckout,
  useNftTokens,
  useFormValidation,
} from '@/composables'

import { ErrorHandler, safeInject } from '@/helpers'
import { BN, BnLike } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { FORM_STATES, TOKEN_TYPES } from '@/enums'
import { required, truthyValue, not } from '@/validators'
import {
  PaymentToken,
  BridgeChain,
  EstimatedPrice,
  ChainNames,
} from '@rarimo/nft-checkout'
import { config } from '@/config'
import { ethers } from 'ethers'
import { EstimatedPriceInfo } from '@/common/NftCheckoutInfo.vue'
import { UseImageEditor } from 'simple-fabric-vue-image-editor'

type SelectOption = {
  label: string
  value: string
}
const TOKEN_AMOUNT_COEFFICIENT = 1.02

const {
  bookInfo: book,
  formState: { isFormDisabled, formState, enableForm, disableForm },
  submit,
  isFormValid,
} = safeInject(PurchaseFormKey)

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
const { buildFormMintData } = useNftTokens()

const form = reactive({
  sourceChain: '',
  paymentToken: undefined as PaymentToken | undefined,
})

const isDevelopment = config.DEPLOY_ENVIRONMENT === 'development'

const isLoading = ref(true)
const isLoadingPrice = ref(false)
const isFetchingTokens = ref(false)
const noAvailableTokens = ref(false)

const chainListRaw = ref<BridgeChain[]>([])
const paymentTokensRaw = ref<PaymentToken[]>([])

const paymentTokensList = ref<SelectOption[]>([])
const sourceChainList = ref<SelectOption[]>([])

const estimatedPrice = ref<EstimatedPriceInfo>()

let priceRaw: EstimatedPrice | undefined = undefined

const {
  isFormValid: isTemplateValid,
  touchField,
  getFieldErrorMessage,
} = useFormValidation(
  { ...toRefs(form), noAvailableTokens },
  {
    sourceChain: { required },
    paymentToken: { truthyValue },
    noAvailableTokens: { not: not(truthyValue) },
  },
)

const formattedTokenAmount = computed(() => {
  if (!tokenPrice.value) return ''

  return new BN(book.pricePerOneToken as BnLike, {
    decimals: tokenPrice.value.token.decimals,
  })
    .fromFraction(tokenPrice.value.token.decimals)
    .div(tokenPrice.value.price)
    .toString()
})

const targetChain = computed(() =>
  isDevelopment
    ? chainListRaw.value.find(chain => chain.name === ChainNames.Sepolia)
    : chainListRaw.value.find(chain => chain.name === ChainNames.Polygon),
)

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
    await getPrice('', TOKEN_TYPES.native, Number(config.DEFAULT_CHAIN_ID))

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

  if (!targetChain.value) return

  if (
    !book.networks.some(
      network => network.attributes.chain_id === Number(targetChain.value!.id),
    )
  )
    return

  return {
    sourceChain,
    targetChain: targetChain.value,
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
  if (!form.paymentToken) return

  const price = await getEstimatedPrice(form.paymentToken)

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

  const nftPrice = new BN(book.pricePerOneToken as BnLike, {
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

const submitFunc = async (editorInstance: UseImageEditor | null) => {
  if (
    !priceRaw ||
    !provider.value.selectedAddress ||
    !editorInstance ||
    !tokenPrice.value
  )
    return

  formState.value = FORM_STATES.pending
  try {
    const banner = await editorInstance.canvasToFormData('Document')

    if (!banner) throw new Error('Failed to format canvas to FormData')

    const { buyParams, signature } = await buildFormMintData({
      banner,
      book,
      account: provider.value.selectedAddress,
      chainId: Number(provider.value.chainId),
      tokenAddress: '',
    })

    const nativeTokenAmount = new BN(book.pricePerOneToken as BnLike, {
      decimals: tokenPrice.value.token.decimals,
    })
      .div(tokenPrice.value.price)
      .mul(TOKEN_AMOUNT_COEFFICIENT)
      .toFixed()

    await performCheckout(priceRaw, {
      buyParams,
      signature,
      amountOfEth: nativeTokenAmount,
    })

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
  () => form.paymentToken,
  async () => {
    if (!form.paymentToken) return

    isLoadingPrice.value = true
    disableForm()
    try {
      await initializeEstimatedPrice()
    } catch (error) {
      ErrorHandler.process(error)
    }
    isLoadingPrice.value = false
    enableForm()
  },
)

watch(
  () => form.sourceChain,
  async () => {
    if (!form.sourceChain) return

    noAvailableTokens.value = false
    isFetchingTokens.value = true

    disableForm()
    try {
      const bridgeChains = getBridgeChains()

      if (!bridgeChains) throw new Error('no bridge chains found')

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
    await initForm()
    isLoading.value = false
  },
  { immediate: true },
)
</script>
