<template>
  <div class="color-field">
    <label v-if="label" :for="`color-field--${uid}`" class="color-field__label">
      {{ label }}
    </label>
    <input
      class="color-field__input"
      type="color"
      :id="`color-field--${uid}`"
      v-on="listeners"
    />
  </div>
</template>

<script setup lang="ts">
import uuid from 'uuidv4'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
  }>(),
  {
    modelValue: '',
    label: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const uid = uuid()

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    if (props.modelValue === eventTarget.value) return

    emit('update:modelValue', eventTarget.value)
  },
}))
</script>

<style scoped lang="scss">
.color-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.color-field__label {
  @include field-label;

  @include text-ellipsis;
}

.color-field__input {
  --size: #{toRem(40)};

  width: var(--size);
  height: var(--size);
  background-color: transparent;
  border: none;
  cursor: pointer;

  &::-webkit-color-swatch {
    border-radius: toRem(8);
    border: toRem(2) solid var(--primary-main);
  }
}
</style>
