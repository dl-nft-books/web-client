<template>
  <modal
    :is-shown="isShown"
    :is-close-by-click-outside="false"
    @update:is-shown="value => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div ref="modalPaneRef" :class="modalPaneClasses">
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
            :book="props.book"
            :is-valid-chain="isValidChain"
            @submitting="isSubmitting = $event"
            @submit="emit('submit', $event)"
          />
        </div>
      </div>
    </template>
  </modal>
</template>

<script lang="ts" setup>
import { AppButton, Modal } from '@/common'

import { ref, computed } from 'vue'
import { PurchaseBookForm } from '@/forms'
import { FullBookInfo } from '@/types'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isShown: boolean
  isValidChain: boolean
  book: FullBookInfo
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
  (event: 'submit', message?: string): void
}>()

const { t } = useI18n()

const isSubmitting = ref(false)
const modalPaneRef = ref<HTMLElement | null>(null)

const { height } = useElementSize(modalPaneRef)
const { height: windowHeight } = useWindowSize()

const title = computed(() =>
  isSubmitting.value
    ? t('purchasing-modal.generation-title')
    : t('purchasing-modal.title'),
)

const modalPaneClasses = computed(() => {
  const maxThreshold = 150
  const threshold = windowHeight.value - height.value

  return [
    'purchasing-modal__pane',
    threshold <= maxThreshold ? 'purchasing-modal__pane--scrollable' : '',
  ]
})
</script>

<style lang="scss" scoped>
.purchasing-modal__pane {
  display: flex;
  flex-direction: column;
  max-height: vh(96);
  width: fit-content;
  padding: toRem(32);
  background: var(--background-primary-light);
  border-radius: toRem(10);

  &--scrollable {
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    border-radius: 0 toRem(10) toRem(10) 0;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 0 toRem(10) toRem(10) 0;
  }

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
