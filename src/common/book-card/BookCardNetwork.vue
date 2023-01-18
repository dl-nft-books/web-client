<template>
  <div class="book-card-network">
    <icon class="book-card-network__icon" :name="getIconName(scheme)" />
    <p class="book-card-network__name">
      {{ name }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import { NETWORKS } from '@/enums'
import { useContext } from '@/composables'

const { $icons } = useContext()

withDefaults(
  defineProps<{
    name: string
    scheme?: NETWORKS
  }>(),
  {
    scheme: NETWORKS.ETHEREUM,
  },
)

const getIconName = (scheme: NETWORKS) => {
  switch (scheme) {
    case 'polygon':
      return $icons.polygon
    case 'ethereum':
      return $icons.ethereum
    case 'q':
      return $icons.q
    default:
      return $icons.ban
  }
}
</script>

<style lang="scss" scoped>
.book-card-network {
  background-color: var(--text-primary-main);
  width: fit-content;
  height: toRem(31);
  padding: 0 toRem(10);
  position: absolute;
  bottom: toRem(4);
  right: 0;
  border-radius: toRem(12) 0 toRem(12) 0;
  display: flex;
  align-items: center;
  gap: toRem(10);
}

.book-card-network__icon {
  max-width: toRem(18);
  max-height: toRem(16);
  color: var(--primary-main);
}

.book-card-network__name {
  font-weight: 400;
  font-size: toRem(15);
  line-height: toRem(16);
  padding-top: toRem(2);
  color: var(--text-primary-invert-light);
}
</style>
