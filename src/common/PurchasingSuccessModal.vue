<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="value => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="purchasing-success-modal__pane">
        <div class="purchasing-success-modal__head">
          <h4>
            {{ $t('purchasing-success-modal.head-title') }}
          </h4>
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
          <h5 class="purchasing-success-modal__title">
            {{ $t('purchasing-success-modal.title') }}
          </h5>
          <p class="purchasing-success-modal__message">
            {{ message }}
          </p>
          <a
            v-if="link"
            class="purchasing-success-modal__link"
            target="_blank"
            :href="link"
          >
            {{ $t('purchasing-success-modal.link') }}
          </a>
          <app-button
            class="purchasing-success-modal__purchase-btn"
            :text="$t('purchasing-success-modal.ok-btn')"
            size="small"
            @click="modal.close"
          />
        </div>
      </div>
    </template>
  </modal>
</template>

<script lang="ts" setup>
import { AppButton, Modal, Animation } from '@/common'

import success from '@/assets/animations/success.json'

withDefaults(
  defineProps<{
    isShown: boolean
    message?: string
    link?: string
  }>(),
  {
    message: '',
    link: '',
  },
)

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
}>()
</script>

<style lang="scss" scoped>
.purchasing-success-modal__pane {
  display: flex;
  flex-direction: column;
  max-width: toRem(452);
  padding: toRem(32);
  background: var(--background-primary-light);
  border-radius: toRem(10);
}

.purchasing-success-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: toRem(36);
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
}

.purchasing-success-modal__message {
  text-align: center;
  margin-bottom: toRem(36);
  max-width: toRem(310);
  font-size: toRem(18);
  line-height: 160%;
}

.purchasing-success-modal__purchase-btn {
  min-width: toRem(144);
  text-transform: uppercase;
}

.purchasing-success-modal__link {
  margin-bottom: toRem(40);
}
</style>
