<script lang="ts" setup>
import { AppButton, Modal } from '@/common'

import { Book } from '@/types'
import { formatFiatAsset } from '@/helpers'
import InputField from '@/fields/InputField.vue'
import { reactive } from 'vue'

defineProps<{
  isShown: boolean
  book: Book
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
}>()

const form = reactive({
  tokenAddress: '',
  signature: '',
})
</script>

<template>
  <modal
    :is-shown="isShown"
    @update:is-shown="value => emit('update:is-shown', value)"
  >
    <template #default="{ modal }">
      <div class="purchasing-modal__pane">
        <div class="purchasing-modal__head">
          <h3 class="purchasing-modal__head-title">
            {{ $t('purchasing-modal.title') }}
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
          <div class="purchasing-modal__body-preview">
            <div class="purchasing-modal__body-preview-img-wrp">
              <img
                class="purchasing-modal__body-preview-img"
                :src="book.coverUrl"
                :alt="book.title"
              />
            </div>
            <div class="purchasing-modal__body-preview-details">
              <span class="purchasing-modal__body-preview-over-title">
                {{ book.meta.volume }}
              </span>
              <h4 class="purchasing-modal__body-preview-title">
                {{ book.title }}
              </h4>
              <span class="purchasing-modal__body-preview-price">
                {{ formatFiatAsset(book.price.amount, book.price.assetCode) }}
              </span>
            </div>
          </div>
          <input-field
            class="purchasing-modal__input"
            v-model="form.tokenAddress"
            :label="$t('purchasing-modal.token-address-lbl')"
          />
          <input-field
            class="purchasing-modal__textarea"
            v-model="form.tokenAddress"
            :label="$t('purchasing-modal.signature-lbl')"
          />
          <app-button
            class="purchasing-modal__purchase-btn"
            :text="$t('purchasing-modal.purchase-btn')"
            size="small"
          />
        </div>
      </div>
    </template>
  </modal>
</template>

<style lang="scss" scoped>
.purchasing-modal__pane {
  display: flex;
  flex-direction: column;
  max-width: toRem(460);
  max-height: toRem(615);
  padding: toRem(32);
  background: var(--background-primary);
  border-radius: toRem(10);
}

.purchasing-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: toRem(36);
}

.purchasing-modal__head-title {
  font-size: toRem(24);
  line-height: 1.2;
  font-weight: 600;
}

.purchasing-modal__body-preview {
  display: flex;
  gap: toRem(20);
  padding-bottom: toRem(24);
  margin-bottom: toRem(24);
  border-bottom: toRem(1) solid var(--border-primary-main);
}

.purchasing-modal__body-preview-img-wrp {
  filter: drop-shadow(0 toRem(4) toRem(8) rgba(150, 150, 157, 0.25));
  max-width: toRem(120);
  max-height: toRem(120);
}

.purchasing-modal__body-preview-img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

.purchasing-modal__body-preview-details {
  display: flex;
  flex-direction: column;
}

.purchasing-modal__body-preview-over-title {
  font-size: toRem(14);
  line-height: 1.2;
  margin-bottom: toRem(6);
}

.purchasing-modal__body-preview-title {
  text-transform: uppercase;
  font-size: toRem(18);
  line-height: 1.2;
  font-weight: 600;
}

.purchasing-modal__body-preview-price {
  text-transform: uppercase;
  margin-top: auto;
  font-size: toRem(22);
  line-height: 1.2;
  font-weight: 900;
  color: var(--primary-main);
}

.purchasing-modal__input {
  margin-bottom: toRem(16);
}

.purchasing-modal__textarea {
  margin-bottom: toRem(36);
}

.purchasing-modal__purchase-btn {
  margin: 0 auto;
  min-width: toRem(144);
}
</style>
