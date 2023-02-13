<template>
  <div class="input-field" :class="inputClasses">
    <label v-if="label" class="input-field__label">
      {{ label }}
    </label>
    <div class="input-field__input-wrp">
      <input
        class="input-field__input"
        v-bind="$attrs"
        v-on="listeners"
        :value="modelValue"
        :placeholder="placeholder"
        :tabindex="isDisabled || isReadonly ? -1 : $attrs.tabindex"
        :type="isPasswordType && isPasswordShown ? 'text' : type"
        :min="min"
        :max="max"
        :disabled="isDisabled || isReadonly"
      />
      <div v-if="isPasswordType || iconName" class="input-field__icon-wrp">
        <button
          type="button"
          v-if="isPasswordType"
          @click="isPasswordShown = !isPasswordShown"
        >
          <icon
            class="input-field__icon"
            :name="isPasswordShown ? $icons.eye : $icons.eyeOff"
          />
        </button>
        <icon v-else class="input-field__icon" :name="iconName" />
      </div>
    </div>
    <transition
      name="input-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="input-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { BN } from '@distributedlab/utils'
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

type INPUT_TYPES = 'text' | 'password' | 'number'
type SCHEMES = 'icon-left' | 'default'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    type?: INPUT_TYPES
    schemes?: SCHEMES
    errorMessage?: string
    iconName?: ICON_NAMES | null
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: ' ',
    type: 'text',
    schemes: 'default',
    errorMessage: '',
    iconName: null,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string | number): void
}>()

const attrs = useAttrs()

const isPasswordShown = ref(false)

const isNumberType = computed(() => props.type === 'text')
const isPasswordType = computed(() => props.type === 'password')

const min = computed((): string => (attrs?.min as string) || '')
const max = computed((): string => (attrs?.max as string) || '')

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement
    if (isNumberType.value) {
      eventTarget.value = normalizeRange(eventTarget.value)
    }
    if (props.modelValue === eventTarget.value) return

    emit('update:modelValue', eventTarget.value)
  },
}))

const inputClasses = computed(() => {
  const _schemes = props.schemes
  const classList = [
    ...(_schemes ? [_schemes.split(' ')] : []),
    ...(isDisabled.value ? ['disabled'] : []),
    ...(isReadonly.value ? ['readonly'] : []),
    ...(props.errorMessage ? ['error'] : []),
    ...(props.iconName || isPasswordType ? ['iconed'] : []),
  ]

  return classList.map(el => `input-field--${el}`).join(' ')
})

const normalizeRange = (value: string | number): string => {
  let result = value

  if (min.value && new BN(value).compare(min.value) < 0) {
    result = min.value
  } else if (max.value && new BN(value).compare(max.value) > 0) {
    result = max.value
  }

  return result as string
}

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}
</script>

<style lang="scss" scoped>
.input-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
  }
}

.input-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @include field-label;

  .input-field--error & {
    color: var(--field-error);
  }
}

.input-field__input-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-field__input {
  padding: var(--field-padding);
  transition-property: box-shadow;

  @include field-text;

  @include field-border;

  &::-webkit-input-placeholder {
    @include field-placeholder;
  }

  &::-moz-placeholder {
    @include field-placeholder;
  }

  &:-moz-placeholder {
    @include field-placeholder;
  }

  &:-ms-input-placeholder {
    @include field-placeholder;
  }

  &::placeholder {
    @include field-placeholder;
  }

  &:not(:read-only) {
    box-shadow: inset 0 0 0 toRem(50) var(--field-bg);
  }

  // Hide number arrows
  &[type='number'] {
    -moz-appearance: textfield;

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .input-field--error & {
    border-color: var(--field-error);
  }

  .input-field--iconed & {
    padding-right: calc(var(--field-padding-right) * 3);
  }

  .input-field--icon-left & {
    padding-right: var(--field-padding-right);
    padding-left: calc(var(--field-padding-right) * 3);
  }

  &:not([disabled]):focus {
    box-sizing: border-box;
    box-shadow: 0 0 0 toRem(1.5) var(--field-border-focus);
    border-color: var(--field-border-focus);
  }

  &:not([disabled]):not(:focus):hover {
    border-color: var(--field-border-hover);
  }
}

.input-field__icon-wrp {
  @include flex-container-row-centered;

  position: absolute;
  top: 50%;
  right: calc(var(--field-padding-right) * 3 / 2);
  transform: translate(50%, -50%);

  .input-field--icon-left & {
    right: 0;
    left: calc(var(--field-padding-right) * 3 / 2);
    transform: translate(-50%, -50%);
    width: max-content;
  }
}

.input-field__icon {
  width: toRem(18);
  height: toRem(18);
}

.input-field__err-msg {
  @include field-error;
}

.input-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.input-field__err-msg-transition-leave-active {
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
