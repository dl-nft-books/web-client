<template>
  <div class="readonly-field">
    <input-field
      v-model="fieldValue"
      :error-message="errorMessage"
      :label="label"
      readonly
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { InputField } from '@/fields'

const props = withDefaults(
  defineProps<{
    value?: string
    label?: string
    errorMessage?: string
  }>(),
  {
    value: '',
    label: '',
    errorMessage: '',
  },
)

const fieldValue = ref(props.value)
</script>

<style lang="scss" scoped>
.readonly-field {
  :deep(.input-field) {
    opacity: 1;
  }

  :deep(.input-field__input) {
    background-color: var(--background-primary-light);
    border: none;
    border-bottom: toRem(1) solid var(--field-border);
  }
}
</style>
