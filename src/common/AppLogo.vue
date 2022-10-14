<script lang="ts" setup>
import { Icon } from '@/common'

type SCHEMES = 'dark' | 'light'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEMES
  }>(),
  {
    scheme: 'dark',
  },
)

</script>

<template>
  <router-link
    :class="`app-logo app-logo--${props.scheme}`"
    :to="{ name: $routes.home }"
  >
    <icon
      class="app-logo__book-icon"
      :name="$icons.book"
    />
    <icon
      class="app-logo__store-text-icon"
      :name="$icons.distributedStoreText"
    />
  </router-link>
</template>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  color: var(--text-primary-main);

  &--light {
    color: var(--text-primary-invert-main);
  }
}

.app-logo__book-icon {
  max-width: toRem(30);
  max-height: toRem(45);
  margin-right: toRem(10);
}

.app-logo__store-text-icon {
  max-width: toRem(200);
  max-height: toRem(15);
}
</style>
