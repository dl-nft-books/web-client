<template>
  <form class="radio-select">
    <radio-field
      v-for="option in valueOptions"
      v-model="pickedValue"
      :value="option.value"
      :key="option.value"
      :label="option.label"
      :group-name="name"
    />
    <transition
      name="radio-select__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="radio-select__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RadioField } from '@/fields'

type ValueOption = {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    name: string
    modelValue?: string
    errorMessage?: string
    valueOptions: ValueOption[]
  }>(),
  {
    modelValue: '',
    errorMessage: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const pickedValue = ref(props.modelValue)

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}

watch(pickedValue, () => {
  emit('update:modelValue', pickedValue.value)
})
</script>

<style lang="scss" scoped>
.radio-select {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.radio-select__err-msg {
  @include field-error;

  font-size: toRem(12);
  padding-left: toRem(35);
}

.radio-select__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.radio-select__err-msg-transition-leave-active {
  animation: fade-down var(--field-transition-duration) reverse;
}

@keyframes fade-down {
  from {
    height: 0;
  }

  to {
    height: var(--field-error-msg-height);
  }
}
</style>
