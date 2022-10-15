<script lang="ts" setup>
import { AppButton, Modal, Animation } from '@/common'

import success from '@/assets/animations/success.json'

defineProps<{
  isShown: boolean
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
}>()
</script>

<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="value => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="purchasing-success-modal__pane">
        <div class="purchasing-success-modal__head">
          <h3 class="purchasing-success-modal__head-title">
            {{ $t('purchasing-success-modal.head-title') }}
          </h3>
          <app-button
            class="purchasing-success-modal__close-btn"
            :icon-right="$icons.x"
            color="default"
            scheme="default"
            size="x-small"
            @click="modal.close"
          />
        </div>
        <div class="purchasing-success-modal__body">
          <div class="purchasing-success-modal__animation-wrp">
            <animation
              class="purchasing-success-modal__animation"
              :animation-data="success"
              :loop="true"
              :speed="0.75"
            />
          </div>
          <h4 class="purchasing-success-modal__title">
            {{ $t('purchasing-success-modal.title') }}
          </h4>
          <span class="purchasing-success-modal__message">
            {{ $t('purchasing-success-modal.message') }}
          </span>
          <app-button
            class="purchasing-success-modal__purchase-btn"
            :text="$t('purchasing-success-modal.ok-btn')"
            size="small"
          />
        </div>
      </div>
    </template>
  </modal>
</template>

<style lang="scss" scoped>
.purchasing-success-modal__pane {
  display: flex;
  flex-direction: column;
  max-width: toRem(452);
  max-height: toRem(492);
  padding: toRem(32);
  background: var(--background-primary);
  border-radius: toRem(10);
}

.purchasing-success-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: toRem(36);
}

.purchasing-success-modal__head-title {
  font-size: toRem(24);
  line-height: 1.2;
  font-weight: 600;
}

.purchasing-success-modal__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.purchasing-success-modal__animation-wrp {
  margin-bottom: toRem(30);
  max-width: toRem(140);
  max-height: toRem(140);
}

.purchasing-success-modal__title {
  margin-bottom: toRem(16);
  font-size: toRem(18);
  line-height: 1.2;
  font-weight: 600;
}

.purchasing-success-modal__message {
  text-align: center;
  margin-bottom: toRem(36);
  max-width: toRem(310);
  font-size: toRem(18);
  line-height: 1.2;
}

.purchasing-success-modal__purchase-btn {
  min-width: toRem(144);
}
</style>
