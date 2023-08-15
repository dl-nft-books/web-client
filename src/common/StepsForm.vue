<template>
  <div class="steps-form">
    <header class="steps-form__header">
      <div
        v-for="step in stepsNumber"
        :key="step"
        class="steps-form__header-status"
      >
        <p class="steps-form__header-status-lbl">
          {{ $t('steps-form.step-lbl', { number: step }) }}
        </p>
        <div
          class="steps-form__header-indicator"
          :class="{
            'steps-form__header-indicator--active': currentStepIndex === step,
          }"
        />
      </div>
    </header>
    <div
      v-for="step in stepsNumber"
      v-show="currentStepIndex === step"
      :key="step"
    >
      <slot :name="`step${step}`" />
    </div>

    <footer class="steps-form__actions">
      <app-button
        v-if="!isFirstStep"
        class="steps-form__actions-btn"
        scheme="flat"
        size="x-small"
        :disabled="isFormDisabled"
        :icon-left="$icons.arrowLeft"
        :text="$t('steps-form.prev-step-lbl')"
        @click="previousStep"
      />
      <app-button
        class="steps-form__actions-btn"
        size="x-small"
        :text="nextButtonText"
        :disabled="isFormDisabled"
        @click="nextStep"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import { AppButton } from '@/common'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  submitText: string
  isFormValid: () => boolean
  isFormDisabled: boolean
}>()

const emit = defineEmits<{
  (event: 'submit'): void
}>()

const slots = useSlots()

const { t } = useI18n()

const currentStepIndex = ref(1)

const stepsNumber = computed(() => Object.keys(slots).length)
const isFirstStep = computed(() => currentStepIndex.value === 1)
const isFinalStep = computed(() => currentStepIndex.value === stepsNumber.value)

const nextButtonText = computed(() =>
  isFinalStep.value ? props.submitText : t('steps-form.next-step-lbl'),
)

const submit = () => {
  if (!props.isFormValid()) return

  emit('submit')
}

const nextStep = () => {
  if (!props.isFormValid()) return

  if (isFinalStep.value) {
    submit()
    return
  }

  currentStepIndex.value++
}

const previousStep = () => {
  if (isFirstStep.value) return

  currentStepIndex.value--
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
  padding: 0 toRem(5);
}

.steps-form__header-status {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: toRem(6);
}

.steps-form__header-status-lbl {
  line-height: 120%;
}

.steps-form__header-indicator {
  height: toRem(4);
  background-color: var(--background-primary-main);
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
  margin-bottom: toRem(10);
  height: toRem(46);
  min-width: toRem(144);
  font-weight: 600;

  @include respond-to(small) {
    &:first-child:last-child {
      min-width: 100%;
    }
  }
}
</style>
