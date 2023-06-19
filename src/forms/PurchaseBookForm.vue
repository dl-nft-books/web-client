<template>
  <div class="purchase-book-form">
    <generation-view v-if="formState === FORM_STATES.pending" />

    <generation-success-view
      v-else-if="formState === FORM_STATES.success"
      :message="successMessage.message"
      :link="successMessage.txLink"
    />

    <steps-form
      v-else
      :submit-text="$t('purchase-book-form.generate-btn')"
      :is-form-valid="checkFormValidation"
      :is-form-disabled="isFormDisabled"
      @submit="submit(editorInstance)"
    >
      <template #step1>
        <form class="purchase-book-form__form">
          <!-- Components from templates will be teleported here -->
          <section id="purchase-book-form__preview">
            <book-preview v-if="!paymentType" :book="book" />
          </section>

          <message-field
            :title="$t('purchase-book-form.rarimo-tip')"
            modification="no-icon"
            scheme="info"
          />

          <!-- 
            That component is responsible for switching between integrated
            payment types and default ones
           -->
          <radio-select
            v-if="isValidChain"
            v-model="paymentType"
            :value-options="paymentOptions"
            name="payment-select"
          />

          <component v-if="paymentType" :is="paymentFlow" />
        </form>
      </template>

      <template #step2>
        <image-editor
          ref="editorInstance"
          :image-url="book.banner.attributes.url"
        />
      </template>
    </steps-form>
  </div>
</template>

<script setup lang="ts">
import 'simple-fabric-vue-image-editor/dist/fabric-vue-image-editor-ts.css'
import { ImageEditor, UseImageEditor } from 'simple-fabric-vue-image-editor'

import { computed, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { StepsForm, BookPreview } from '@/common'
import { RadioSelect, MessageField } from '@/fields'
import { FullBookInfo, PurchaseFormKey } from '@/types'
import { FORM_STATES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import {
  GenerationView,
  GenerationSuccessView,
  DefaultPaymentFlow,
  RarimoFlow,
} from '@/forms/purchase-book-form'

enum PAYMENT_TYPES {
  rarimo = 'rarimo',
  default = 'default',
}

const props = defineProps<{
  book: FullBookInfo
}>()

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)
const isValidChain = computed(() =>
  Boolean(
    props.book.networks.some(
      network => network.attributes.chain_id === Number(provider.value.chainId),
    ),
  ),
)

const formState = ref<FORM_STATES>(FORM_STATES.active)

// Form validation occurs inside templates and vary from component to component
const isFormValid = ref<(() => boolean) | null>(null)

/* 
  Each payment template implements its own version of submit function, that at
  the end of purchase will be invoked here
*/
const submitFunc = ref<(editor: UseImageEditor | null) => Promise<void>>()
const successMessage = ref<{
  message: string
  txLink?: string
}>({
  message: t('generation-success-view.message'),
})

const editorInstance = ref<{
  editorInstance: UseImageEditor | null
}>()

// if chain invalid - goes with rarimo by default
const paymentType = ref<PAYMENT_TYPES | undefined>(
  !isValidChain.value ? PAYMENT_TYPES.rarimo : undefined,
)

const paymentOptions = [
  {
    label: t('purchase-book-form.default-payment'),
    value: PAYMENT_TYPES.default,
  },
  {
    label: t('purchase-book-form.rarimo-payment'),
    value: PAYMENT_TYPES.rarimo,
  },
]

const paymentFlow = computed(() => {
  switch (paymentType.value) {
    case PAYMENT_TYPES.rarimo:
      return RarimoFlow
    case PAYMENT_TYPES.default:
    default:
      return DefaultPaymentFlow
  }
})

const isFormDisabled = computed(() => formState.value === FORM_STATES.disabled)

const submit = (editor: typeof editorInstance.value) => {
  if (!submitFunc.value || !editor) return

  submitFunc.value(editor.editorInstance)
}

const checkFormValidation = () => {
  if (!isFormValid.value) return false

  return isFormValid.value()
}

provide(PurchaseFormKey, {
  formState,
  bookInfo: props.book,
  isFormValid,
  submit: submitFunc,
  successMessage,
})
</script>

<style lang="scss" scoped>
.purchase-book-form__form {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  width: toRem(400);
  padding: 0 toRem(5);

  @include respond-to(small) {
    width: 100%;
  }
}
</style>
