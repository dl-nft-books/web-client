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
  <steps-form
    v-else
    :submit-text="$t('purchase-book-form.generate-btn')"
    :is-next-step-disabled="isNextStepDisabled"
    @submit="submit(editorInstance?.editorInstance)"
  >
    <template #step1>
      <form class="purchase-book-form" @submit.prevent>
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

        <component
          :is="paymentTemplate"
          ref="paymentTemplateRef"
          :book="book"
        />
      </form>
    </template>

    <template #step2>
      <image-editor
        ref="editorInstance"
        :image-url="book.banner.attributes.url"
      />
    </template>
  </steps-form>
</template>

<script lang="ts" setup>
import 'simple-fabric-vue-image-editor/dist/fabric-vue-image-editor-ts.css'

import { ref, reactive, computed, Ref, provide } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { BN } from '@/utils/math.util'
import { ImageEditor, UseImageEditor } from 'simple-fabric-vue-image-editor'

import {
  Platform,
  Promocode,
  TokenPrice,
  PurchaseFormKey,
  MintSignatureResponse,
  Task,
} from '@/types'
import { TOKEN_TYPES } from '@/enums'

import { Animation, BookPreview, StepsForm } from '@/common'

import {
  NativeTemplate,
  Erc20Template,
  VoucherTemplate,
  NftTemplate,
} from '@/forms/purchase-book-payments'

import {
  useForm,
  useFormValidation,
  useNftTokens,
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
const provider = computed(() => web3ProvidersStore.provider)

const { createNewGenerationTask, getMintSignature, uploadBanner } =
  useGenerator()
const { mintWithErc20, mintWithEth, mintWithNft, approveTokenSpend } =
  useNftTokens()

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

const isNextStepDisabled = computed(
  () => isFormDisabled.value || !paymentTemplateRef.value?.isFormValid(),
)

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

  if (props.book.isNFTBuyable) {
    defaultOptions.push({
      label: globalizeTokenType(TOKEN_TYPES.nft),
      value: TOKEN_TYPES.nft,
    })
  }

  return defaultOptions
})
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

  switch (form.tokenType) {
    case TOKEN_TYPES.native:
      if (!nativeTokenAmount) throw new Error('Missing native token amount')

      await mintWithEth(
        {
          tokenContract: bookContract.attributes.contract_address,
          tokenURI: generatedTask.metadata_ipfs_hash,
          endTimestamp: mintSignature.end_timestamp,
          futureTokenId: mintSignature.token_id.toString(),
          paymentDetails: {
            paymentTokenAddress: ethers.constants.AddressZero,
            paymentTokenPrice: mintSignature.price,
            nftTokenId: '0',
            discount: mintSignature.discount,
          },
        },
        mintSignature.signature,
        nativeTokenAmount,
      )
      break
    case TOKEN_TYPES.erc20:
      if (!tokenAddress) throw new Error('ERC20 address is missing')

      await mintWithErc20(
        {
          tokenContract: bookContract.attributes.contract_address,
          tokenURI: generatedTask.metadata_ipfs_hash,
          endTimestamp: mintSignature.end_timestamp,
          futureTokenId: mintSignature.token_id.toString(),
          paymentDetails: {
            paymentTokenAddress: tokenAddress,
            paymentTokenPrice: mintSignature.price,
            nftTokenId: '0',
            discount: mintSignature.discount,
          },
        },
        mintSignature.signature,
      )
      break
    case TOKEN_TYPES.nft: {
      if (!tokenId) throw new Error('Nft token id is missing')

      await mintWithNft(
        {
          tokenContract: bookContract.attributes.contract_address,
          tokenURI: generatedTask.metadata_ipfs_hash,
          endTimestamp: mintSignature.end_timestamp,
          futureTokenId: mintSignature.token_id.toString(),
          paymentDetails: {
            paymentTokenAddress: tokenAddress,
            paymentTokenPrice: mintSignature.price,
            nftTokenId: tokenId,
            discount: mintSignature.discount,
          },
        },
        mintSignature.signature,
      )
      break
    }
    default:
      break
  }
}

const editorInstance = ref<{
  editorInstance: UseImageEditor | null
}>()

/* FIXME: for some fucked up reason when im trying to invoke functions 
from editorInsance inside submit function - editorInstance appears to be null

if <image-editor /> is not being passed though slots to another component -
it works as expected - you getting all what you want from editorInstance

but if <image-editor /> passed through named slots its just doesn't work and the
only solution i figure out for now its to pass editorInstance directly from 
template to the submit func and now its working perfectly fine.

*/
const submit = async (editorFromTemplate: UseImageEditor | null) => {
  if (
    !isFormValid() ||
    !paymentTemplateRef.value?.isFormValid() ||
    !provider.value.selectedAddress ||
    !editorFromTemplate
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

  try {
    const banner = await editorFromTemplate.canvasToFormData('Document')

    if (!banner) throw new Error('Failed to format canvas to FormData')

    const currentTask = await createNewGenerationTask({
      account: provider.value.selectedAddress,
      bookId: props.book.id,
      chainId: Number(provider.value.chainId),
    })

    const generatedTask = await uploadBanner(currentTask.id, banner)

    const mintSignature = await getMintSignature(
      props.currentPlatform.id,
      generatedTask.id,
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
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  width: toRem(350);
  padding: 0 toRem(5);

  @include respond-to(small) {
    width: 100%;
  }
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
