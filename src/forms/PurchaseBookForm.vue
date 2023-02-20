<template>
  <!-- While NFT is being generated -->
  <template v-if="isFormDisabled">
    <div class="purchase-book-form__submitting-animation-wrp">
      <animation
        class="purchase-book-form__submitting-animation"
        :animation-data="loaderAnimation"
        :loop="true"
        :speed="1"
      />
    </div>
    <h5 class="purchase-book-form__submitting-title">
      {{ $t('purchase-book-form.submitting-title') }}
    </h5>
    <p class="purchase-book-form__submitting-message">
      {{ $t('purchase-book-form.submitting-message') }}
    </p>
  </template>

  <!-- Before generation stuff -->
  <form v-else class="purchase-book-form" @submit.prevent="submit">
    <book-preview
      :book="book"
      :modification="
        form.tokenType === TOKEN_TYPES.nft ? 'floor-price' : 'default'
      "
    />

    <select-field
      v-model="form.tokenType"
      class="purchase-book-form__select"
      :label="$t('purchase-book-form.token-type-lbl')"
      :value-options="tokenTypesOptions"
      :error-message="getFieldErrorMessage('tokenType')"
      :disabled="isFormDisabled"
      @blur="touchField('tokenType')"
    />

    <component :is="paymentTemplate" ref="paymentTemplateRef" :book="book" />
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, Ref, provide } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { BN } from '@/utils/math.util'

import { createNewTask, getMintSignature } from '@/api'

import {
  Platform,
  Promocode,
  TokenPrice,
  PurchaseFormKey,
  MintSignatureResponse,
  Task,
} from '@/types'
import { TOKEN_TYPES } from '@/enums'
import { BookRecord } from '@/records'

import { Animation, BookPreview } from '@/common'

import {
  NativeTemplate,
  Erc20Template,
  VoucherTemplate,
  NftTemplate,
} from '@/forms/purchase-book-payments'

import {
  useForm,
  useFormValidation,
  useNftBookToken,
  useErc20,
  useErc721,
} from '@/composables'

import { SelectField } from '@/fields'
import {
  ErrorHandler,
  untilTaskFinishedGeneration,
  globalizeTokenType,
} from '@/helpers'

import { required } from '@/validators'

import loaderAnimation from '@/assets/animations/loader.json'
import { ethers } from 'ethers'

export type ExposedFormRef = {
  isFormValid: () => boolean
  promocode: Ref<Promocode | null>
  signature: Ref<string>
  tokenAddress: Ref<string>
  tokenAmount: Ref<string>
  tokenPrice: Ref<TokenPrice | null>
  tokenId?: Ref<string>
}

const TOKEN_AMOUNT_COEFFICIENT = 1.02

const props = defineProps<{
  book: BookRecord
  currentPlatform: Platform
}>()

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'submitting', value: boolean): void
}>()

const { provider } = useWeb3ProvidersStore()
const nftBookToken = useNftBookToken(provider, props.book.contractAddress)
const erc20 = useErc20(provider)
const erc721 = useErc721(provider)

const form = reactive({
  tokenType: TOKEN_TYPES.native,
})

const { disableForm, enableForm, isFormDisabled } = useForm()
const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    tokenType: { required },
  },
)

// to avoid props drilling - passing necessary info using provide -> inject
provide(PurchaseFormKey, {
  platform: props.currentPlatform,
  isFormDisabled,
})

const paymentTemplateRef = ref<ExposedFormRef | null>(null)

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
    {
      label: globalizeTokenType(TOKEN_TYPES.voucher),
      value: TOKEN_TYPES.voucher,
    },
    {
      label: globalizeTokenType(TOKEN_TYPES.nft),
      value: TOKEN_TYPES.nft,
    },
  ]

  /* 
    Temporary solution because of missing price for Q on backend
    Will be fixed in future updates
  */
  const qNetworkIdentifier = 'q'

  if (props.currentPlatform.id !== qNetworkIdentifier) {
    defaultOptions.push({
      label: globalizeTokenType(TOKEN_TYPES.erc20),
      value: TOKEN_TYPES.erc20,
    })
  }

  return defaultOptions
})

const approveTokenSpend = async (
  tokenType: TOKEN_TYPES,
  tokenAmount?: string,
  tokenAddress?: string,
  tokenId?: string,
) => {
  if (!provider.selectedAddress) return

  switch (tokenType) {
    case TOKEN_TYPES.erc20:
      if (!tokenAddress || !tokenAmount) return
      erc20.init(tokenAddress)

      await erc20.approveSpend(
        provider.selectedAddress,
        tokenAmount,
        props.book.contractAddress,
      )
      break
    case TOKEN_TYPES.voucher:
      erc20.init(props.book.voucherToken)

      await erc20.approveSpend(
        provider.selectedAddress,
        props.book.voucherTokenAmount,
        props.book.contractAddress,
      )
      break
    case TOKEN_TYPES.nft:
      if (!tokenAddress || !tokenId) return
      erc721.init(tokenAddress)

      await erc721.approve(props.book.contractAddress, tokenId)
      break
    default:
      break
  }
}

// Minting with ERC721 requires to invoke different mint function on contract
const mintToken = async (
  mintSignature: MintSignatureResponse,
  generatedTask: Task,
  tokenAddress: string,
  tokenId?: string,
  nativeTokenAmount?: string,
) => {
  if (form.tokenType !== TOKEN_TYPES.nft) {
    await nftBookToken.mintToken(
      tokenAddress || ethers.constants.AddressZero,
      mintSignature.price,
      mintSignature.discount,
      mintSignature.end_timestamp,
      generatedTask!.metadata_ipfs_hash,
      mintSignature.signature.r,
      mintSignature.signature.s,
      mintSignature.signature.v,
      nativeTokenAmount,
    )

    return
  }

  if (!tokenId) return

  await nftBookToken.mintTokenByNFT(
    tokenAddress,
    mintSignature.price,
    tokenId,
    mintSignature.end_timestamp,
    generatedTask!.metadata_ipfs_hash,
    mintSignature.signature.r,
    mintSignature.signature.s,
    mintSignature.signature.v,
  )
}

const submit = async () => {
  if (
    !isFormValid() ||
    !paymentTemplateRef.value?.isFormValid() ||
    !provider.selectedAddress
  )
    return

  const dataForMint = {
    tokenAddress: paymentTemplateRef.value?.tokenAddress,
    tokenPrice: paymentTemplateRef.value?.tokenPrice,
    tokenId: paymentTemplateRef.value.tokenId,
    tokenAmount: paymentTemplateRef.value?.tokenAmount,
    signature: paymentTemplateRef.value?.signature,
    promocode: paymentTemplateRef.value.promocode,
  }

  disableForm()
  emit('submitting', true)

  try {
    const { data: currentTask } = await createNewTask({
      signature: paymentTemplateRef.value.signature,
      account: provider.selectedAddress,
      bookId: props.book.id,
    })

    const generatedTask = await untilTaskFinishedGeneration(currentTask.id)

    const { data: mintSignature } = await getMintSignature(
      props.currentPlatform.id,
      generatedTask!.id,
      dataForMint.tokenAddress,
      dataForMint.promocode ? dataForMint.promocode.id : undefined,
      form.tokenType === TOKEN_TYPES.nft,
    )

    const nativeTokenAmount =
      form.tokenType !== TOKEN_TYPES.native
        ? ''
        : new BN(props.book.price, {
            decimals: dataForMint.tokenPrice.token.decimals,
          })
            .div(dataForMint.tokenPrice.price)
            .mul(TOKEN_AMOUNT_COEFFICIENT)
            .toFixed()

    await approveTokenSpend(
      form.tokenType,
      dataForMint.tokenAmount,
      dataForMint.tokenAddress,
      dataForMint.tokenId,
    )

    await mintToken(
      mintSignature,
      generatedTask,
      dataForMint.tokenAddress,
      dataForMint.tokenId,
      nativeTokenAmount,
    )

    emit('submitting', false)
    emit('submit')
  } catch (e) {
    ErrorHandler.process(e)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.purchase-book-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.purchase-book-form__submitting-animation-wrp {
  margin: 0 auto toRem(30);
  max-width: toRem(300);
}

.purchase-book-form__submitting-title {
  text-align: center;
}

.purchase-book-form__submitting-message {
  max-width: toRem(310);
  text-align: center;
  font-size: toRem(18);
  line-height: 160%;
}
</style>
