<template>
  <router-link
    :class="`app-logo app-logo--${props.scheme}`"
    :to="{ name: $routes.bookshelf }"
    @click="hideSidebar"
  >
    <icon class="app-logo__book-icon" :name="$icons.book" />
    <div class="app-logo__text-wrapper">
      <p class="app-logo__title">
        {{ $t('app-logo.title') }}
      </p>
      <div class="app-logo__subtitle-wrapper">
        <span class="app-logo__subtitle">{{ $t('app-logo.subtitle') }}</span>
        <span class="app-logo__subtitle app-logo__subtitle--acsent">{{
          $t('app-logo.acsent')
        }}</span>
      </div>
    </div>
  </router-link>
</template>

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

const emit = defineEmits<{
  (event: 'hideSidebar'): void
}>()

const hideSidebar = () => {
  emit('hideSidebar')
}
</script>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  gap: toRem(15);
  color: var(--text-primary-main);
  position: relative;
  transition: opacity 0.2s ease-in-out;

  &--light {
    color: var(--text-primary-invert-main);
  }

  &:after {
    content: '';
    position: absolute;
    width: toRem(38);
    height: toRem(2);
    left: toRem(25);
    background-color: var(--primary-main);
    transform: rotate(90deg);

    @include respond-to(medium) {
      left: toRem(15);
      width: toRem(30);
    }
  }

  &:hover {
    opacity: 0.7;
  }
}

.app-logo__book-icon {
  max-width: toRem(30);
  max-height: toRem(44);
  margin-right: toRem(10);

  @include respond-to(medium) {
    max-width: toRem(20);
    max-height: toRem(35);
  }
}

.app-logo__text-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(5);

  @include respond-to(medium) {
    gap: toRem(2);
  }
}

.app-logo__title {
  line-height: toRem(16);
  font-size: toRem(18);
  letter-spacing: toRem(1);

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.app-logo__subtitle {
  font-size: toRem(13);
  line-height: toRem(16);

  &--acsent {
    color: var(--primary-main);
  }

  @include respond-to(medium) {
    font-size: toRem(11);
  }
}

.app-logo__subtitle-wrapper {
  display: flex;
  gap: toRem(2);
}
</style>
