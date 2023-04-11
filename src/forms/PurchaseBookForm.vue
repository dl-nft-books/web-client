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
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { BN } from '@/utils/math.util'

import {
  Platform,
  Promocode,
  TokenPrice,
  PurchaseFormKey,
  MintSignatureResponse,
  Task,
} from '@/types'
import { TOKEN_TYPES } from '@/enums'

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
  useErc20,
  useErc721,
  useMarketplace,
  useContractRegistry,
  useGenerator,
  FullBookInfo,
} from '@/composables'

import { SelectField } from '@/fields'
import { ErrorHandler, globalizeTokenType } from '@/helpers'

import { required } from '@/validators'

import loaderAnimation from '@/assets/animations/loader.json'
import { ethers } from 'ethers'

export type ExposedFormRef = {
  isFormValid: () => boolean
  promocode: Ref<Promocode | null>
  tokenAddress: Ref<string>
  tokenAmount: Ref<string>
  tokenPrice: Ref<TokenPrice | null>
  tokenId?: Ref<string>
}

const TOKEN_AMOUNT_COEFFICIENT = 1.02

const props = defineProps<{
  book: FullBookInfo
  currentPlatform: Platform
}>()

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'submitting', value: boolean): void
}>()

const web3ProvidersStore = useWeb3ProvidersStore()
const networkStore = useNetworksStore()
const provider = computed(() => web3ProvidersStore.provider)

const { createNewGenerationTask, getMintSignature, getGeneratedTask } =
  useGenerator()

const marketPlace = useMarketplace()
const contractRegistry = useContractRegistry()
const erc20 = useErc20()
const erc721 = useErc721()

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

const isTokenApproved = async (
  tokenAmount: string,
  tokenAddress?: string,
): Promise<boolean> => {
  if (tokenAddress) erc20.init(tokenAddress)

  const allowance = await erc20.getAllowance(
    provider.value.selectedAddress!,
    props.book.tokenContract,
  )

  if (
    new BN(allowance?.toString() || 0).compare(tokenAmount) === 1 ||
    new BN(allowance?.toString() || 0).compare(tokenAmount) === 0
  ) {
    return true
  } else if (new BN(allowance?.toString() || 0).compare(tokenAmount) === -1) {
    await erc20.approve(props.book.tokenContract, tokenAmount)
  }

  return isTokenApproved(tokenAmount)
}

const approveTokenSpend = async (
  tokenType: TOKEN_TYPES,
  tokenAmount?: string,
  tokenAddress?: string,
  tokenId?: string,
) => {
  if (!provider.value.selectedAddress) return

  const bookContract = props.book.networks.find(
    el => el.attributes.chain_id === Number(provider.value.chainId),
  )

  if (!bookContract)
    throw new Error('No matching book contract found for that chain')

  switch (tokenType) {
    case TOKEN_TYPES.erc20:
      if (!tokenAddress || !tokenAmount) return
      await isTokenApproved(tokenAmount, tokenAddress)
      break
    case TOKEN_TYPES.voucher:
      await isTokenApproved(
        props.book.voucherTokensAmount as string,
        props.book.voucherTokenContract as string,
      )

      break
    case TOKEN_TYPES.nft:
      if (!tokenAddress || !tokenId) return
      erc721.init(tokenAddress)

      await erc721.approve(bookContract.attributes.contract_address, tokenId)
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
  const bookContract = props.book.networks.find(
    el => el.attributes.chain_id === Number(provider.value.chainId),
  )

  if (!bookContract)
    throw new Error('No matching book contract found for that chain')

  if (form.tokenType !== TOKEN_TYPES.nft) {
    await marketPlace.mintToken(
      bookContract.attributes.contract_address,
      mintSignature.token_id.toString(),
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

  await marketPlace.mintTokenByNFT(
    bookContract.attributes.contract_address,
    mintSignature.token_id.toString(),
    tokenAddress,
    mintSignature.price,
    tokenId,
    mintSignature.end_timestamp,
    generatedTask!.metadata_ipfs_hash,
    mintSignature.signature.r,
    mintSignature.signature.s,
    mintSignature.signature.v,
  )

  // await nftBookToken.mintTokenByNFT(
  //   tokenAddress,
  //   mintSignature.price,
  //   tokenId,
  //   mintSignature.end_timestamp,
  //   generatedTask!.metadata_ipfs_hash,
  //   mintSignature.signature.r,
  //   mintSignature.signature.s,
  //   mintSignature.signature.v,
  // )
}

const initMarketplace = async () => {
  const registryAddress = networkStore.list.find(
    el => el.chain_id === Number(provider.value.chainId),
  )

  if (!registryAddress) throw new Error('Failed to get registry address')

  contractRegistry.init(registryAddress.factory_address)

  const marketPlaceAddress = await contractRegistry.getMarketPlaceAddress()

  if (!marketPlaceAddress) throw new Error('Failed to get marketplace address')

  marketPlace.init(marketPlaceAddress)
}

const submit = async () => {
  if (
    !isFormValid() ||
    !paymentTemplateRef.value?.isFormValid() ||
    !provider.value.selectedAddress
  )
    return

  const dataForMint = {
    tokenAddress: paymentTemplateRef.value?.tokenAddress,
    tokenPrice: paymentTemplateRef.value?.tokenPrice,
    tokenId: paymentTemplateRef.value.tokenId,
    tokenAmount: paymentTemplateRef.value?.tokenAmount,
    promocode: paymentTemplateRef.value.promocode,
  }

  disableForm()
  emit('submitting', true)

  await initMarketplace()

  try {
    const currentTask = await createNewGenerationTask({
      account: provider.value.selectedAddress,
      bookId: props.book.id,
      chainId: Number(provider.value.chainId),
    })

    const generatedTask = await getGeneratedTask(currentTask.id)

    const mintSignature = await getMintSignature(
      props.currentPlatform.id,
      generatedTask!.id,
      dataForMint.tokenAddress,
      dataForMint.promocode ? dataForMint.promocode.id : undefined,
      form.tokenType === TOKEN_TYPES.nft,
    )

    const nativeTokenAmount =
      form.tokenType !== TOKEN_TYPES.native
        ? ''
        : new BN(props.book.pricePerOneToken, {
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
      generatedTask!,
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
