<template>
  <div class="no-data-message">
    <icon class="no-data-message__icon" :name="iconName" />
    <span class="no-data-message__message">
      {{ message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    iconName?: ICON_NAMES
    message: string
  }>(),
  {
    iconName: ICON_NAMES.archive,
  },
)
</script>

<style lang="scss" scoped>
.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(12);
}

.no-data-message__icon {
  color: var(--text-primary-light);
  font-size: toRem(48);

  @include respond-to(small) {
    width: toRem(120);
    height: toRem(120);
  }
}

.no-data-message__message {
  color: var(--text-primary-light);
  font-size: toRem(18);
}
</style>
