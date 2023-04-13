<template>
  <nav class="app-navbar">
    <app-logo scheme="dark" />
    <button
      class="app-navbar__hamburger-button"
      type="button"
      :aria-label="$t('app-navbar.burger-button-label')"
      @click="openSidebar"
    >
      <icon
        class="app-navbar__hamburger-button-icon"
        :name="$icons.hamburgerMenu"
      />
    </button>
    <div class="app-navbar__links-wrapper">
      <router-link
        class="app-navbar__text-link"
        :to="{ name: $routes.bookshelf }"
      >
        {{ $t('app-navbar.bookshelf-link') }}
      </router-link>
      <router-link v-if="false" class="app-navbar__text-link" to="/">
        {{ $t('app-navbar.about-link') }}
      </router-link>
      <router-link class="app-navbar__text-link" :to="{ name: $routes.myNfts }">
        {{ $t('app-navbar.my-nfts-link') }}
      </router-link>
      <router-link
        class="app-navbar__text-link"
        :to="{ name: $routes.aboutUs }"
      >
        {{ $t('app-navbar.about-us-link') }}
      </router-link>
    </div>
    <div class="app-navbar__provider-button-wrapper">
      <app-button
        v-if="!provider.selectedAddress"
        class="app-navbar__provider-btn"
        scheme="flat"
        size="small"
        :icon-left="$icons.metamask"
        :disabled="provider.selectedAddress"
        :text="$t('app-navbar.connect-provider-button')"
        @click="handleProviderClick"
      />
      <account-info v-else modification="dark-mode" />
    </div>
    <app-navigation-mobile />
  </nav>
</template>

<script lang="ts" setup>
import {
  AppButton,
  AppLogo,
  Icon,
  AppNavigationMobile,
  AccountInfo,
} from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { Bus } from '@/helpers'
import { storeToRefs } from 'pinia'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const openSidebar = () => {
  Bus.emit(Bus.eventList.openSidebar)
}

const handleProviderClick = () => {
  if (provider.value.selectedAddress) {
    return
  }
  provider.value.connect()
}
</script>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(30) var(--app-padding-right) toRem(30) var(--app-padding-left);
  z-index: var(--z-index-layer-3);
  position: relative;
  background-color: var(--background-primary-dark);

  @include respond-to(small) {
    width: 100%;
  }
}

.app-navbar__links-wrapper {
  display: flex;
  text-transform: uppercase;
  align-items: center;
  margin: 0 auto;
  column-gap: toRem(50);

  @include respond-to(medium) {
    display: none;
  }
}

.app-navbar__text-link {
  transition: 0.2s ease-in-out;
  transition-property: color;
  color: var(--text-primary-main);

  &:hover {
    color: var(--text-primary-dark);
  }

  &.router-link-active {
    border-bottom: toRem(2) solid var(--primary-main);
  }
}

.app-navbar__provider-btn {
  --app-button-bg-hover: var(--background-quaternary);
  --app-button-bg: var(--background-quinary);
  --app-button-flat-border: #{toRem(1)} solid var(--border-primary-light);
  --app-button-flat-text-hover: var(--text-primary-invert-main);

  text-transform: uppercase;
  font-weight: 500;
  padding: toRem(9) toRem(16);
  color: var(--text-primary-light);

  &:disabled {
    opacity: 1;
  }

  &:deep(.app-button__icon-left) {
    width: toRem(30);
    height: toRem(30);
  }
}

.app-navbar__hamburger-button {
  width: toRem(32);
  height: toRem(32);
  display: none;

  @include respond-to(medium) {
    display: block;
  }
}

.app-navbar__hamburger-button-icon {
  width: 100%;
  height: 100%;
  color: var(--text-primary-main);
}

.app-navbar__provider-button-wrapper {
  @include respond-to(medium) {
    display: none;
  }
}
</style>
