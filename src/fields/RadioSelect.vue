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
    valueOptions: ValueOption[]
  }>(),
  {
    modelValue: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const pickedValue = ref(props.modelValue)

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
</style>
