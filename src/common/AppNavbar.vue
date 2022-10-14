<script lang="ts" setup>
import { AppButton, AppLogo } from '@/common'
</script>

<template>
  <nav class="app-navbar">
    <app-logo />
    <div class="app-navbar__links-wrapper">
      <router-link class="app-navbar__text-link" to="/">
        {{ $t('app-navbar.bookshelf-link') }}
      </router-link>
      <router-link v-if="false" class="app-navbar__text-link" to="/">
        {{ $t('app-navbar.about-link') }}
      </router-link>
      <router-link class="app-navbar__text-link" to="/">
        {{ $t('app-navbar.my-nfts-link') }}
      </router-link>
    </div>
    <div class="app-navbar__provider-button-wrapper">
      <app-button
        class=".app-navbar__provider-btn"
        type="button"
        :icon-left="$icons.metamask"
        scheme="flat"
        :text="$t('app-navbar.connect-provider-button')"
      />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(30) var(--app-padding-right) toRem(30) var(--app-padding-left);
}

.app-navbar__links-wrapper {
  display: flex;
  margin: 0 auto;
  justify-self: center;
  text-transform: uppercase;
  column-gap: toRem(50);
}

.app-navbar__text-link {
  color: var(--text-secondary-main);
  text-decoration: none;
  font-family: var(--app-font-family);
  font-weight: 500;
  font-size: toRem(16);
}

.app-navbar__provider-btn {
  font-family: var(--app-font-family);
  color: var(--text-secondary-main);
  font-size: toRem(16);
  text-transform: uppercase;
  font-weight: 500;
}
</style>
