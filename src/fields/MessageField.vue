<template>
  <div :class="messageClasses">
    <icon class="message-field__icon" :name="icon" />
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

type SCHEMES = 'error' | 'success'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEMES
    icon?: ICON_NAMES
    title: string
    subtitle?: string | null
  }>(),
  {
    scheme: 'error',
    icon: ICON_NAMES.exclamationCircle,
    subtitle: null,
  },
)

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
    background: var(--background-error);
  }

  &--success {
    background: var(--background-success);
  }
}

.message-field__icon {
  --size: #{toRem(15)};

  max-width: var(--size);
  max-height: var(--size);

  .message-field--error & {
    color: var(--error-main);
  }
}

.message-field__title {
  font-size: toRem(14);
  line-height: 1.2;

  .message-field--error & {
    color: var(--error-main);
  }

  .message-field--success & {
    color: var(--text-success);
  }
}
</style>
