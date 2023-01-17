<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="value => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="purchasing-modal__pane">
        <div class="purchasing-modal__head">
          <h3 class="purchasing-modal__head-title">
            {{ title }}
          </h3>
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
                <span class="purchasing-modal__wrong-network-message">
                  {{ $t('purchasing-modal.wrong-network-message') }}
                </span>
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
import { BookRecord } from '@/records'
import { ErrorHandler } from '@/helpers'
import { ref, computed } from 'vue'
import { useContext } from '@/composables'
import { config } from '@config'
import { getPlatformsList } from '@/api'
import { PurchaseBookForm } from '@/forms'

import disableChainAnimation from '@/assets/animations/disable-chain.json'

const props = defineProps<{
  isShown: boolean
  book: BookRecord
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
  (event: 'submit'): void
}>()

const { $t } = useContext()

const isLoaded = ref(false)
const isSubmitting = ref(false)
const currentPlatform = ref()
const isLoadFailed = ref(false)

const { provider } = storeToRefs(useWeb3ProvidersStore())

const isValidChain = computed(
  () => currentPlatform.value?.chain_identifier === provider.value.chainId,
)

const title = computed(() => {
  if (!isValidChain.value && isLoaded.value)
    return $t('purchasing-modal.wrong-network-title')
  return isSubmitting.value
    ? $t('purchasing-modal.generation-title')
    : $t('purchasing-modal.title')
})

async function init() {
  isLoaded.value = false
  try {
    const { data: platforms } = await getPlatformsList()
    console.log(platforms)

    console.log('book', props.book)

    // FIXME: fix platforms hardcode
    currentPlatform.value =
      config.DEPLOY_ENVIRONMENT === 'production'
        ? platforms.find(i => i.id === 'polygon-pos')
        : platforms.find(i => i.id === 'ethereum')
    console.log(
      currentPlatform.value,
      platforms.find(i => i.id === 'polygon-pos'),
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

.purchasing-modal__head-title {
  font-size: toRem(24);
  line-height: 1.2;
  font-weight: 600;
}

.purchasing-modal__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: toRem(20);
  gap: toRem(20);
  overflow-y: auto;
}

.purchasing-modal__wrong-network-animation-wrp {
  margin: 0 auto toRem(30);
  max-width: toRem(240);
}

.purchasing-modal__wrong-network-message {
  max-width: toRem(310);
  font-size: toRem(18);
  line-height: 1.2;
  text-align: center;
}
</style>
