<script lang="ts" setup>
import { AppButton, AppLogo, Icon, AppNavigationMobile } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { Bus, cropAddress } from '@/helpers'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = useI18n({ useScope: 'global' })

const openSidebar = () => {
  Bus.emit(Bus.eventList.openSidebar)
}

const handleProviderClick = () => {
  if (provider.value.selectedAddress) {
    return
  }
  provider.value.connect()
}

const connectProviderButtonText = computed(() => {
  return provider.value.selectedAddress
    ? cropAddress(provider.value.selectedAddress)
    : t('app-navbar.connect-provider-button')
})

const isAboutPage = computed(() => {
  return router.currentRoute.value.name === ROUTE_NAMES.aboutUs
})
</script>

<template>
  <nav class="app-navbar" :class="{ 'app-navbar--dark': isAboutPage }">
    <app-logo />
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
        class="app-navbar__provider-btn"
        :icon-left="$icons.metamask"
        scheme="flat"
        size="small"
        :disabled="provider.selectedAddress"
        :text="connectProviderButtonText"
        @click="handleProviderClick"
      />
    </div>
    <app-navigation-mobile />
  </nav>
</template>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(30) var(--app-padding-right) toRem(30) var(--app-padding-left);

  &--dark {
    background-color: var(--background-quinary);

    & > * {
      color: var(--text-primary-invert-light);
    }
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
  color: var(--text-secondary-main);
  text-decoration: none;
  font-family: var(--app-font-family);
  font-weight: 500;
  font-size: toRem(16);

  &.router-link-active {
    border-bottom: toRem(2) solid var(--primary-main);
  }
}

.app-navbar__provider-btn {
  text-transform: uppercase;
  font-family: var(--app-font-family);
  color: var(--text-secondary-main);
  font-size: toRem(16);
  font-weight: 500;
  padding: toRem(9) toRem(16);

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
}

.app-navbar__provider-button-wrapper {
  @include respond-to(medium) {
    display: none;
  }
}
</style>
