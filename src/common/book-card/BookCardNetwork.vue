<template>
  <div class="book-card-network">
    <icon class="book-card-network__icon" :name="getIconByScheme(scheme)" />
    <p class="book-card-network__name">
      {{ name }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import { NETWORKS } from '@/enums'
import { getIconByScheme } from '@/helpers'

withDefaults(
  defineProps<{
    name: string
    scheme?: NETWORKS
  }>(),
  {
    scheme: NETWORKS.ETHEREUM,
  },
)
</script>

<style lang="scss" scoped>
.book-card-network {
  background-color: var(--text-primary-main);
  width: fit-content;
  height: toRem(31);
  padding: 0 toRem(10);
  position: absolute;
  bottom: 0;
  right: toRem(-2);
  border-radius: toRem(12) 0 toRem(12) 0;
  display: flex;
  align-items: center;
  gap: toRem(7);
}

.book-card-network__icon {
  max-width: toRem(18);
  max-height: toRem(16);
  color: var(--primary-main);
}

.book-card-network__name {
  font-size: toRem(15);
  padding-top: toRem(2);

  @include text-color-invert;
}
</style>
