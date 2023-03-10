<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="value => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="purchasing-modal__pane">
        <div class="purchasing-modal__head">
          <h4>
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
          <template v-if="isLoaded">
            <error-message
              v-if="isLoadFailed"
              :message="$t('purchasing-modal.loading-error-msg')"
            />
            <template v-else>
              <purchase-book-form
                v-if="isValidChain"
                :book="props.book"
                :current-platform="currentPlatform"
                @submitting="isSubmitting = $event"
                @submit="emit('submit')"
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
                  @click="switchNetwork(book.chain_id)"
                />
              </template>
            </template>
          </template>
          <loader v-else />
        </div>
      </div>
    </template>
  </modal>
</template>

<script lang="ts" setup>
import { AppButton, Modal, Animation, Loader, ErrorMessage } from '@/common'

import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ErrorHandler, switchNetwork } from '@/helpers'
import { ref, computed } from 'vue'
import { getPlatformsList } from '@/api'
import { PurchaseBookForm } from '@/forms'

import disableChainAnimation from '@/assets/animations/disable-chain.json'
import { ETHEREUM_CHAINS, POLYGON_CHAINS, Q_CHAINS } from '@/enums'
import { Book, Platform } from '@/types'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isShown: boolean
  book: Book
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
  (event: 'submit'): void
}>()

const { t } = useI18n()

const isLoaded = ref(false)
const isSubmitting = ref(false)
const currentPlatform = ref<Platform>()
const isLoadFailed = ref(false)

const { provider } = storeToRefs(useWeb3ProvidersStore())

const isValidChain = computed(
  () => props.book.chain_id === Number(provider.value.chainId),
)

const title = computed(() => {
  if (!isValidChain.value && isLoaded.value)
    return t('purchasing-modal.wrong-network-title')
  return isSubmitting.value
    ? t('purchasing-modal.generation-title')
    : t('purchasing-modal.title')
})

// Pricer returns price only for not test networks, for debug need to convert
function formatChain(chainId: number): string {
  switch (chainId.toString()) {
    case POLYGON_CHAINS.mumbai:
    case POLYGON_CHAINS.mainnet:
      return POLYGON_CHAINS.mainnet
    case ETHEREUM_CHAINS.goerli:
    case ETHEREUM_CHAINS.ethereum:
      return ETHEREUM_CHAINS.ethereum
    case Q_CHAINS.testnet:
    case Q_CHAINS.mainet:
      return Q_CHAINS.mainet
    default:
      return POLYGON_CHAINS.mainnet
  }
}

async function init() {
  isLoaded.value = false
  try {
    const { data: platforms } = await getPlatformsList()

    currentPlatform.value = platforms.find(
      platform =>
        platform.chain_identifier === Number(formatChain(props.book.chain_id)),
    )
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

init()
</script>

<style lang="scss" scoped>
.purchasing-modal__pane {
  display: flex;
  flex-direction: column;
  max-width: toRem(460);
  max-height: 100vh;
  padding: toRem(32);
  background: var(--background-primary);
  border-radius: toRem(10);
  min-width: toRem(460);

  @include respond-to(small) {
    min-width: 100vw;
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
  padding: toRem(20);
  gap: toRem(20);
  overflow-y: auto;

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
</style>
