<template>
  <section class="bookshelf-prices">
    <div class="bookshelf-prices__item">
      <div
        :class="[
          'bookshelf-prices__item-wrapper',
          'bookshelf-prices__item-wrapper--label',
        ]"
      >
        <p class="bookshelf-prices__item-label">
          {{ $t('bookshelf-prices.floor-lbl') }}
        </p>
        <pop-up :message="$t('bookshelf-prices.floor-price-explanation')">
          <icon class="bookshelf-prices__item-icon" :name="$icons.infoCircle" />
        </pop-up>
      </div>
      <p class="bookshelf-prices__item-value">
        {{ floorPrice }}
      </p>
    </div>
    <div class="bookshelf-prices__item">
      <p class="bookshelf-prices__item-label">
        {{ $t('bookshelf-prices.price-lbl') }}
      </p>
      <div class="bookshelf-prices__item-wrapper">
        <p
          :class="[
            'bookshelf-prices__item-value',
            'bookshelf-prices__item-value--acsent',
          ]"
        >
          {{ price }}
        </p>
        <pop-up
          v-if="voucherLink"
          :message="$t('bookshelf-prices.voucher-explanation')"
        >
          <app-button
            class="bookshelf-prices__item-link"
            scheme="default"
            :href="voucherLink"
            :icon-right="$icons.voucher"
          />
        </pop-up>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AppButton, PopUp, Icon } from '@/common'

defineProps<{
  price: string
  floorPrice: string
  voucherLink?: string
}>()
</script>

<style scoped lang="scss">
.bookshelf-prices {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bookshelf-prices__item-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  &--label {
    justify-content: flex-start;
    gap: toRem(9);
  }

  gap: toRem(14);
}

.bookshelf-prices__item {
  display: flex;
  flex-direction: column;
  gap: toRem(7);
}

.bookshelf-prices__item-label {
  font-size: toRem(18);
  line-height: 120%;
  color: var(--text-secondary-main);
  text-transform: uppercase;
}

.bookshelf-prices__item-value {
  font-size: toRem(28);
  font-weight: 600;
  line-height: toRem(34);
  color: var(--text-secondary-dark);

  &--acsent {
    color: var(--primary-main);
  }

  @include respond-to(tablet) {
    font-size: toRem(24);
    line-height: toRem(29);
  }
}

.bookshelf-prices__item-link {
  padding: 0 0 toRem(2) 0;
}

.bookshelf-prices__item-icon {
  --size: #{toRem(18)};

  max-width: var(--size);
  max-height: var(--size);
  padding: 0 0 toRem(1) 0;
}
</style>
