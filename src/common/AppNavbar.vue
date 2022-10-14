<script lang="ts" setup>
import { Icon } from '@/common'
import { AppButton } from '@/common'
</script>

<template>
  <nav class="app-navbar">
    <router-link :to="$routes.home" class="app-navbar__logo-wrapper">
      <icon class="app-navbar__book-icon" :name="$icons.book" />
      <icon
        class="app-navbar__store-text-icon"
        :name="$icons.distributedStoreText"
      />
    </router-link>
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
    <div class="app-navbar__metamask-button-wrapper">
      <app-button
        class="app-navbar__metamask-button"
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

.app-navbar__logo-wrapper {
  display: flex;
  align-items: center;
  color: var(--text-primary-main);
}

.app-navbar__book-icon {
  max-width: toRem(30);
  max-height: toRem(45);
  margin-right: toRem(10);
}

.app-navbar__store-text-icon {
  max-width: toRem(200);
  max-height: toRem(15);
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

.app-navbar__metamask-button {
  font-family: var(--app-font-family);
  color: var(--text-secondary-main);
  font-size: toRem(16);
  text-transform: uppercase;
  font-weight: 500;
}
</style>
