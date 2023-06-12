<template>
  <div class="radio-field" :class="radioClasses">
    <input
      :id="`radio-field--${uid}`"
      :name="groupName"
      v-bind="$attrs"
      :value="value"
      class="radio-field__button"
      type="radio"
      @change="onChange"
    />
    <label v-if="label" :for="`radio-field--${uid}`" class="radio-field__label">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import uuid from 'uuidv4'
import { useAttrs, computed } from 'vue'

withDefaults(
  defineProps<{
    modelValue?: string
    value?: string
    label?: string
    groupName?: string
  }>(),
  {
    modelValue: '',
    value: '',
    label: '',
    groupName: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const uid = uuid()

const attrs = useAttrs()

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const radioClasses = computed(() => {
  const classList = [
    ...(isDisabled.value ? ['disabled'] : []),
    ...(isReadonly.value ? ['readonly'] : []),
  ]

  return classList.map(el => `radio-field--${el}`).join(' ')
})

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (target.checked) emit('update:modelValue', target.value)
}
</script>

<style lang="scss" scoped>
.radio-field {
  display: flex;
  align-items: center;
  gap: toRem(8);
}

.radio-field__label {
  @include text-ellipsis;

  @include field-label;

  &:hover {
    cursor: pointer;
  }
}

.radio-field__button {
  --size: #{toRem(19)};

  appearance: none;
  -webkit-appearance: none;
  border-radius: 50%;
  background-color: var(--background-primary-light);
  border: toRem(6) solid var(--background-primary-light);
  box-shadow: 0 0 0 toRem(1) var(--primary-main);
  min-width: var(--size);
  min-height: var(--size);
  transition: background-color 0.15s ease-in-out;
  position: relative;
  bottom: toRem(2);

  &:hover {
    cursor: pointer;
    background-color: var(--primary-main);
  }

  &:checked {
    background-color: var(--primary-main);
  }
}
</style>
