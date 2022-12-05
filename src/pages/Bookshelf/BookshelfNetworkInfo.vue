<template>
  <section class="bookshelf-network-info">
    <p class="bookshelf-network-info__title">
      {{ $t('bookshelf-item.network-title') }}
    </p>
    <div class="bookshelf-network-info__wrapper">
      <!-- TODO make this dynamic when network changing will be done -->
      <div class="bookshelf-network-info__item">
        <icon class="bookshelf-network-info__icon" :name="$icons.polygon" />
      </div>
      <p class="bookshelf-network-info__subtitle">
        {{ $t('networks.polygon') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
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
  background-color: var(--polygon-network);
  display: grid;
  place-content: center;
}

.bookshelf-network-info__icon {
  max-width: toRem(26);
  max-height: toRem(22);
  color: var(--white);
}
</style>
