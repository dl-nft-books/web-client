<template>
  <div class="steps-form">
    <header class="steps-form__header">
      <div class="steps-form__header-status">
        <p class="steps-form__header-status-lbl">
          {{ $t('steps-form.step-lbl', { number: 1 }) }}
        </p>
        <div
          class="steps-form__header-indicator"
          :class="{
            'steps-form__header-indicator--active': currentStep === STEPS.first,
          }"
        />
      </div>
      <div class="steps-form__header-status">
        <p class="steps-form__header-status-lbl">
          {{ $t('steps-form.step-lbl', { number: 2 }) }}
        </p>
        <div
          class="steps-form__header-indicator"
          :class="{
            'steps-form__header-indicator--active':
              currentStep === STEPS.second,
          }"
        />
      </div>
    </header>
    <div v-show="currentStep === STEPS.first">
      <slot name="step1" />
    </div>

    <div v-show="currentStep === STEPS.second">
      <slot name="step2" />
    </div>

    <footer class="steps-form__actions">
      <app-button
        v-if="currentStep === STEPS.first"
        class="steps-form__actions-btn"
        size="x-small"
        :disabled="isNextStepDisabled"
        :text="$t('steps-form.next-step-lbl')"
        @click="switchStep(STEPS.second)"
      />
      <template v-else>
        <app-button
          class="steps-form__actions-btn"
          scheme="flat"
          size="x-small"
          :icon-left="$icons.arrowLeft"
          :text="$t('steps-form.prev-step-lbl')"
          @click="switchStep(STEPS.first)"
        />
        <app-button
          :disabled="isNextStepDisabled"
          class="steps-form__actions-btn"
          :text="submitText"
          size="x-small"
          @click="submit"
        />
      </template>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppButton } from '@/common'

enum STEPS {
  first = 'first',
  second = 'second',
}

defineProps<{
  submitText: string
  isNextStepDisabled: boolean
}>()

const emit = defineEmits<{
  (event: 'submit'): void
}>()

const currentStep = ref<STEPS>(STEPS.first)

const submit = () => {
  emit('submit')
}

const switchStep = (type: STEPS) => {
  switch (type) {
    case STEPS.second:
      currentStep.value = STEPS.second
      break
    case STEPS.first:
    default:
      currentStep.value = STEPS.first
      break
  }
}
</script>

<style lang="scss" scoped>
.steps-form {
  width: 100%;
}

.steps-form__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: toRem(36);
  gap: toRem(12);
}

.steps-form__header-status {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: toRem(4);
}

.steps-form__header-status-lbl {
  line-height: 120%;
}

.steps-form__header-indicator {
  height: toRem(4);
  background-color: var(--background-quaternary);
  border-radius: toRem(5);
  width: 100%;
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &--active {
    background-color: var(--primary-main);
    opacity: 0.8;
  }
}

.steps-form__actions {
  display: flex;
  justify-content: center;
  margin-top: toRem(40);
  gap: toRem(16);
}

.steps-form__actions-btn {
  text-transform: uppercase;
  border-radius: toRem(9);
}
</style>
