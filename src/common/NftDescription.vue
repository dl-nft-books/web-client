<template>
  <div class="nft-description">
    <div class="nft-description__badge-wrapper">
      <div
        v-for="(item, index) in badges"
        :key="index"
        class="nft-description__badge"
      >
        <icon class="nft-description__badge-icon" :name="item.icon" />
        <p class="nft-description__badge-text">
          {{ item.label }}
        </p>
      </div>
    </div>
    <p class="nft-description__description">
      {{ description || $t('nft-description.default-desc') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'

type Badge = {
  label: string
  icon: ICON_NAMES
}

const { t } = useI18n()

defineProps<{ description?: string }>()

const badges: Badge[] = [
  {
    label: t('nft-description.badge-1'),
    icon: ICON_NAMES.badgeCircleStar,
  },
  {
    label: t('nft-description.badge-2'),
    icon: ICON_NAMES.badgePencil,
  },
]
</script>

<style lang="scss" scoped>
.nft-description__badge-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(80);
  margin-bottom: toRem(40);

  @include respond-to(small) {
    align-items: flex-start;
    flex-direction: column;
    gap: toRem(20);
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
  font-weight: 500;
  font-style: italic;

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(16);
  }
}

.nft-description__description {
  font-size: toRem(24);
  color: var(--text-secondary-main);
  white-space: pre-wrap;
  word-wrap: break-word;

  @include respond-to(medium) {
    font-size: toRem(18);
  }
}
</style>
