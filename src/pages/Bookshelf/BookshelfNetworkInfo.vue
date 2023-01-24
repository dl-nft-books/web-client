<template>
  <section class="bookshelf-network-info">
    <p class="bookshelf-network-info__title">
      {{ $t('bookshelf-item-page.network-title') }}
    </p>
    <div class="bookshelf-network-info__wrapper">
      <!-- TODO make this dynamic when network changing will be done -->
      <div :class="networkClasses">
        <icon
          class="bookshelf-network-info__icon"
          :name="getIconByScheme(scheme)"
        />
      </div>
      <p class="bookshelf-network-info__subtitle">
        {{ $t('networks.title', { network: name }) }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { NETWORKS } from '@/enums'
import { getIconByScheme } from '@/helpers'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    scheme?: NETWORKS
  }>(),
  {
    scheme: NETWORKS.ETHEREUM,
  },
)

const networkClasses = computed(() => [
  'bookshelf-network-info__item',
  `bookshelf-network-info__item--${props.scheme}`,
])
</script>

<style lang="scss" scoped>
.bookshelf-network-info {
  margin-bottom: toRem(25);
}

.bookshelf-network-info__wrapper {
  display: flex;
  align-items: center;
  height: toRem(82);
  gap: toRem(12);
  padding: toRem(15);
  border: toRem(1) solid rgba(var(--primary-main-rgb), 0.3);
  border-radius: toRem(5);
  background-color: var(--white);
}

.bookshelf-network-info__title {
  font-size: toRem(20);
}

.bookshelf-network-info__subtitle {
  font-weight: 400;
  font-size: toRem(20);
  line-height: 120%;
  color: var(--text-secondary-main);
}

.bookshelf-network-info__item {
  --size: #{toRem(40)};

  width: var(--size);
  height: var(--size);
  border-radius: 100%;
  display: grid;
  place-content: center;

  &--polygon {
    background-color: var(--polygon-network);
  }

  &--ethereum {
    background-color: var(--ethereum-network);
  }

  &--q {
    background-color: var(--q-network);
  }
}

.bookshelf-network-info__icon {
  max-width: toRem(26);
  max-height: toRem(22);
  color: var(--white);

  .bookshelf-network-info__item--q & {
    color: var(--q-network-stroke);
  }
}
</style>
