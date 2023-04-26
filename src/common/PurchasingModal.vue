<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="value => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="purchasing-modal__pane">
        <div class="purchasing-modal__head">
          <h4 class="purchasing-modal__head-title">
            {{ title }}
          </h4>
          <app-button
            class="purchasing-modal__close-btn"
            :icon-right="$icons.x"
            color="default"
            scheme="default"
            size="x-small"
            @click="modal.close"
          />
        </div>
        <div class="purchasing-modal__body">
          <purchase-book-form
            v-if="isValidChain"
            :book="props.book"
            @submitting="isSubmitting = $event"
            @submit="emit('submit', $event)"
          />
          <template v-else>
            <div class="purchasing-modal__wrong-network-animation-wrp">
              <animation
                :animation-data="disableChainAnimation"
                :loop="true"
                :speed="1"
              />
            </div>
            <p class="purchasing-modal__wrong-network-message">
              {{ $t('purchasing-modal.wrong-network-message') }}
            </p>
            <app-button
              size="small"
              :text="$t('networks.switch-btn-lbl')"
              :icon-left="$icons.refresh"
              @click="switchNetwork(book.networks[0].attributes.chain_id)"
            />
          </template>
        </div>
      </div>
    </template>
  </modal>
</template>

<script lang="ts" setup>
import { AppButton, Modal, Animation } from '@/common'

import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { switchNetwork } from '@/helpers'
import { ref, computed } from 'vue'
import { PurchaseBookForm } from '@/forms'

import disableChainAnimation from '@/assets/animations/disable-chain.json'
import { useI18n } from 'vue-i18n'
import { FullBookInfo } from '@/composables'

const props = defineProps<{
  isShown: boolean
  book: FullBookInfo
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
  (event: 'submit', message?: string): void
}>()

const { t } = useI18n()

const isSubmitting = ref(false)

const { provider } = storeToRefs(useWeb3ProvidersStore())

const isValidChain = computed(() =>
  props.book.networks.some(
    ({ attributes: { chain_id } }) =>
      chain_id === Number(provider.value.chainId),
  ),
)

const title = computed(() => {
  if (!isValidChain.value) return t('purchasing-modal.wrong-network-title')
  return isSubmitting.value
    ? t('purchasing-modal.generation-title')
    : t('purchasing-modal.title')
})
</script>

<style lang="scss" scoped>
.purchasing-modal__pane {
  display: flex;
  flex-direction: column;
  max-height: vh(100);
  width: fit-content;
  padding: toRem(32);
  background: var(--background-primary-light);
  border-radius: toRem(10);
  overflow-y: auto;

  @include respond-to(small) {
    width: 100vw;
    padding: toRem(32) toRem(24);
  }
}

.purchasing-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: toRem(36);

  @include respond-to(small) {
    margin-bottom: toRem(20);
  }
}

.purchasing-modal__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(20);

  @include respond-to(small) {
    padding: 0;
  }
}

.purchasing-modal__wrong-network-animation-wrp {
  margin: 0 auto;
  max-width: toRem(300);
}

.purchasing-modal__wrong-network-message {
  max-width: toRem(386);
  text-align: center;
  margin-bottom: toRem(20);
  font-size: toRem(18);
  line-height: 160%;
}

.purchasing-modal__close-btn {
  transition: 0.2s ease-in-out;
  transition-property: transform;

  &:hover {
    transform: rotate(90deg);
  }
}

.purchasing-modal__head-title {
  font-weight: 700;
}
</style>
