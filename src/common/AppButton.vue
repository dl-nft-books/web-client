<template>
  <template v-if="route">
    <router-link
      v-bind="$attrs"
      class="app-button"
      :class="buttonClasses"
      :to="route"
    >
      <icon v-if="iconLeft" :class="iconClasses" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" :class="iconClasses" :name="iconRight" />
    </router-link>
  </template>
  <template v-else-if="href">
    <a
      v-bind="$attrs"
      class="app-button"
      :class="buttonClasses"
      :href="href"
      :target="hrefTarget"
    >
      <icon v-if="iconLeft" :class="iconClasses" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" :class="iconClasses" :name="iconRight" />
    </a>
  </template>
  <template v-else>
    <button
      v-bind="$attrs"
      class="app-button"
      :class="buttonClasses"
      :disabled="isDisabled"
      :type="$attrs.type || 'button'"
    >
      <icon v-if="iconLeft" :class="iconClasses" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" :class="iconClasses" :name="iconRight" />
    </button>
  </template>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { computed, useAttrs } from 'vue'
import { LocationAsRelativeRaw } from 'vue-router'
import { ICON_NAMES } from '@/enums'

type SCHEMES = 'filled' | 'flat' | 'default'

type MODIFICATIONS = 'border-circle' | 'border-rounded' | 'switcher' | 'default'

type HREF_TARGET = '_blank' | '_self' | '_parent' | '_top'
type ICON_SIZE = 'large' | 'medium' | 'x-medium'

type COLORS =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default'

type SIZES = 'large' | 'medium' | 'small' | 'x-small' | 'default'

const props = withDefaults(
  defineProps<{
    text?: string
    scheme?: SCHEMES
    modification?: MODIFICATIONS
    color?: COLORS
    size?: SIZES
    route?: LocationAsRelativeRaw
    href?: string
    hrefTarget?: HREF_TARGET
    iconLeft?: ICON_NAMES
    iconRight?: ICON_NAMES
    iconSize?: ICON_SIZE
  }>(),
  {
    text: '',
    scheme: 'filled',
    modification: 'border-rounded',
    color: 'primary',
    size: 'medium',
    route: undefined,
    href: '',
    hrefTarget: '_blank',
    iconLeft: undefined,
    iconRight: undefined,
    iconSize: 'medium',
  },
)

const attrs = useAttrs()

const isDisabled = computed((): boolean =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const iconClasses = computed(() => {
  let defClass = ''
  if (props.iconLeft) defClass = 'app-button__icon-left'
  if (props.iconRight) defClass = 'app-button__icon-right'

  return defClass.concat(` ${defClass}--${props.iconSize}`)
})

const buttonClasses = computed(() =>
  [
    'app-button',
    `app-button--${props.scheme}`,
    `app-button--${props.modification}`,
    `app-button--${props.color}`,
    `app-button--${props.size}`,
    ...(isDisabled.value ? ['app-button--disabled'] : []),
  ].join(' '),
)
</script>

<style lang="scss" scoped>
.app-button {
  --button-transition-duration: 0.2s;

  display: flex;
  align-items: center;
  justify-content: center;
  outline: 0;
  font-family: var(--app-font-family);
  margin: 0;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  width: max-content;
  transition: var(--button-transition-duration) ease-in;
  transition-property: background-color, color;
  text-decoration: none;
  border: var(--app-button-border);
  background-color: var(--app-button-bg);
  color: var(--app-button-text);

  &:disabled,
  &--disabled {
    cursor: not-allowed;
    pointer-events: none;
    filter: grayscale(0.75);
    opacity: 0.5;
  }

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    text-decoration: none;
    transition-timing-function: ease-out;
    color: var(--app-button-text-hover);
    background-color: var(--app-button-bg-hover);
    border-color: var(--app-button-border-hover);
    border: var(--app-button-border-hover);
  }

  &:not([disabled]):active {
    text-decoration: none;
    transition-timing-function: ease-out;
    background-color: var(--app-button-bg-active);
    border: var(--app-button-border-active);
  }

  &--filled {
    --app-button-filled-bg: var(--primary-main);
    --app-button-filled-bg-hover: var(--primary-dark);
    --app-button-filled-bg-active: var(--primary-dark);

    --app-button-filled-text: var(--text-primary-invert-main);
    --app-button-filled-text-hover: var(--text-primary-invert-main);

    --app-button-bg: var(--app-button-filled-bg);
    --app-button-bg-hover: var(--app-button-filled-bg-hover);
    --app-button-bg-active: var(--app-button-filled-bg-active);

    --app-button-text: var(--app-button-filled-text);
    --app-button-text-hover: var(--app-button-filled-text-hover);

    --app-button-border: 0;
    --app-button-border-hover: 0;
    --app-button-border-active: 0;

    filter: drop-shadow(0 0 toRem(6) rgba(var(--primary-main-rgb), 0.5));

    // on mobile device it leads to problems
    @include respond-to(small) {
      filter: unset;
    }
  }

  &--flat {
    --app-button-flat-text: var(--text-primary-main);
    --app-button-flat-text-hover: var(--text-primary-dark);

    --app-button-flat-border: #{toRem(2)} solid var(--text-primary-light);
    --app-button-flat-border-hover: var(--app-button-flat-border);
    --app-button-flat-border-active: var(--app-button-flat-border);

    --app-button-bg: transparent;
    --app-button-bg-hover: transparent;
    --app-button-bg-active: transparent;

    --app-button-text: var(--app-button-flat-text);
    --app-button-text-hover: var(--app-button-flat-text-hover);

    --app-button-border: var(--app-button-flat-border);
    --app-button-border-hover: var(--app-button-flat-border-hover);
    --app-button-border-active: var(--app-button-flat-border-active);

    &:disabled,
    &--disabled & {
      filter: none;
      opacity: 1;
    }
  }

  &--success {
    --app-button-flat-text: var(--success-main);
    --app-button-flat-text-hover: var(--success-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--success-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--success-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--success-dark);

    --app-button-filled-bg: var(--success-main);
    --app-button-filled-bg-hover: var(--success-dark);
    --app-button-filled-bg-active: var(--success-dark);
  }

  &--error {
    --app-button-flat-text: var(--error-main);
    --app-button-flat-text-hover: var(--error-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--error-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--error-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--error-dark);

    --app-button-filled-bg: var(--error-main);
    --app-button-filled-bg-hover: var(--error-dark);
    --app-button-filled-bg-active: var(--error-dark);
  }

  &--warning {
    --app-button-flat-text: var(--warning-main);
    --app-button-flat-text-hover: var(--warning-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--warning-dark);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--warning-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--warning-dark);

    --app-button-filled-bg: var(--warning-main);
    --app-button-filled-bg-hover: var(--warning-dark);
    --app-button-filled-bg-active: var(--warning-dark);
  }

  &--info {
    --app-button-flat-text: var(--info-main);
    --app-button-flat-text-hover: var(--info-dark);
    --app-button-flat-border: #{toRem(2)} solid var(--info-main);
    --app-button-flat-border-hover: #{toRem(2)} solid var(--info-dark);
    --app-button-flat-border-active: #{toRem(2)} solid var(--info-dark);

    --app-button-filled-bg: var(--info-main);
    --app-button-filled-bg-hover: var(--info-dark);
    --app-button-filled-bg-active: var(--info-dark);
  }

  &--border-circle {
    border-radius: toRem(50);
  }

  &--border-rounded {
    border-radius: toRem(8);
  }

  &--switcher {
    --bg-picked-color: #{rgba(var(--white-rgb), 0.2)};
    --app-button-filled-bg: var(--black);
    --app-button-filled-bg-hover: var(--bg-picked-color);
    --app-button-filled-bg-active: var(--bg-picked-color);

    filter: unset;
  }

  &--large {
    padding: toRem(24) toRem(50);
    grid-gap: toRem(16);
  }

  &--medium {
    padding: toRem(20) toRem(16);
    font-size: toRem(16);
    line-height: 1.4;
    font-weight: 600;
    grid-gap: toRem(12);
    letter-spacing: 0;
  }

  &--small {
    padding: toRem(12) toRem(16);
    grid-gap: toRem(12);
  }

  &--x-small {
    padding: toRem(7) toRem(16);
    grid-gap: toRem(6);
  }
}

.app-button__icon-left,
.app-button__icon-right {
  &--medium {
    height: 1.2em;
    width: 1.2em;
  }

  &--x-medium {
    height: toRem(28);
    width: toRem(28);
  }

  &--large {
    height: 1.8em;
    width: 1.8em;
  }
}

.app-button__text {
  color: inherit;
  font: inherit;
  pointer-events: none;
  word-break: break-all;
  min-width: 0;

  @include text-ellipsis;
}
</style>
