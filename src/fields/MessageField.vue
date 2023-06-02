<template>
  <div :class="messageClasses">
    <icon v-if="!noIcon" class="message-field__icon" :name="icon" />
    <div>
      <p class="message-field__title">
        {{ title }}
      </p>
      <p v-if="subtitle" class="message-field__title">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { computed } from 'vue'

type SCHEMES = 'error' | 'success' | 'info'
type MODIFICATION = 'no-icon' | 'default'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEMES
    modification?: MODIFICATION
    icon?: ICON_NAMES
    title: string
    subtitle?: string | null
  }>(),
  {
    scheme: 'error',
    modification: 'default',
    icon: ICON_NAMES.exclamationCircle,
    subtitle: null,
  },
)

const noIcon = computed(() => props.modification === 'no-icon')

const messageClasses = computed(() => [
  'message-field',
  `message-field--${props.scheme}`,
])
</script>

<style lang="scss" scoped>
.message-field {
  display: flex;
  gap: toRem(10);
  width: 100%;
  border-radius: toRem(4);
  padding: toRem(12) toRem(10);

  &--error {
    background: var(--error-main);
  }

  &--success {
    background: var(--success-dark);
  }

  &--info {
    background: var(--background-tertiary);
    border: toRem(1) solid var(--border-primary-main);
  }
}

.message-field__icon {
  --size: #{toRem(20)};

  max-width: var(--size);
  max-height: var(--size);
  color: var(--text-primary-light);
}

.message-field__title {
  font-size: toRem(14);
  line-height: 1.2;
  font-weight: 600;
  color: var(--text-primary-light);

  .message-field--info & {
    font-weight: 400;
  }
}
</style>
