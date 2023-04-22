<template>
  <div class="book-card-network">
    <div
      v-for="scheme in networks"
      :key="scheme"
      class="book-card-network__wrapper"
    >
      <icon class="book-card-network__icon" :name="getIconByScheme(scheme)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import { NETWORKS } from '@/enums'
import { getIconByScheme } from '@/helpers'

defineProps<{
  networks: NETWORKS[]
}>()
</script>

<style lang="scss" scoped>
.book-card-network {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: toRem(8);
  padding: toRem(8);
}

.book-card-network__wrapper {
  --wrapper-color: #{rgba(var(--background-primary-light-rgb), 0.8)};

  background-color: var(--wrapper-color);
  border-radius: toRem(4);
  display: grid;
  place-content: center;
  width: toRem(40);
  height: toRem(40);
}

.book-card-network__icon {
  max-width: toRem(22);
  max-height: toRem(22);
  color: var(--text-primary-light);
}
</style>
