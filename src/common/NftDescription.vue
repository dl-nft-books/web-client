<script lang="ts" setup>
import { Icon } from '@/common'

defineProps<{ description?: string }>()
</script>

<template>
  <div class="nft-description">
    <div class="nft-description__badges">
      <div class="nft-description__badge">
        <icon
          class="nft-description__badge-icon"
          :name="$icons.badgeCircleStar"
        />
        <span class="nft-description__badge-text">
          {{ $t('nft-description.badge-1') }}
        </span>
      </div>
      <div class="nft-description__badge">
        <icon class="nft-description__badge-icon" :name="$icons.badgePencil" />
        <span class="nft-description__badge-text">
          {{ $t('nft-description.badge-2') }}
        </span>
      </div>
    </div>
    <p class="nft-description__description">
      {{ description }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.nft-description__badges {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(20) toRem(10);
  margin-bottom: toRem(40);

  @include respond-to(small) {
    align-items: flex-start;
    flex-direction: column;
  }
}

.nft-description__badge {
  display: flex;
  align-items: center;
  gap: toRem(24);

  @include respond-to(medium) {
    gap: toRem(10);
  }
}

.nft-description__badge-icon {
  width: toRem(60);
  height: toRem(60);
}

.nft-description__badge-text {
  font-size: toRem(22);
  line-height: 1.2;
  font-weight: 500;
  font-style: italic;

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(14);
  }

  @include respond-to(small) {
    text-align: center;
    font-size: toRem(16);
  }
}

.nft-description__description {
  font-size: toRem(25);
  line-height: 1.2;
  font-weight: 400;

  @include respond-to(medium) {
    font-size: toRem(18);
  }
}
</style>
