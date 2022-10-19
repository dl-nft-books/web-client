<script lang="ts" setup>
import { AppButton, AppLogo } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { cropAddress, isMobileCheck } from '@/helpers'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@/common'
import { AppNavigationMobile } from '@/common'
import { debounce } from 'lodash-es'
const TABLET_WIDTH = 1024
const DEBOUNCE_TIMEOUT = 200

const { provider } = storeToRefs(useWeb3ProvidersStore())
const isMobile = ref(false)
const isBurgerOpen = ref(false)

const handleProviderClick = () => {
  if (provider.value.selectedAddress) {
    provider.value.disconnect()
    return
  }
  provider.value.connect()
}

const setIsMobile = () => {
  isMobile.value = isMobileCheck() || window.innerWidth < TABLET_WIDTH
}

onMounted(() => {
  setIsMobile()
  window.addEventListener('resize', debounce(setIsMobile, DEBOUNCE_TIMEOUT))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', debounce(setIsMobile, DEBOUNCE_TIMEOUT))
})
</script>

<template>
  <nav class="app-navbar">
    <app-logo />
    <button
      v-if="isMobile"
      class="app-navbar__hamburger-button"
      type="button"
      :aria-label="$t('app-navbar.burger-button-label')"
      @click="isBurgerOpen = true"
    >
      <icon
        class="app-navbar__hamburger-button-icon"
        :name="$icons.hamburgerMenu"
      />
    </button>
    <template v-else>
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
        <router-link
          class="app-navbar__text-link"
          :to="{ name: $routes.myNFTs }"
        >
          {{ $t('app-navbar.my-nfts-link') }}
        </router-link>
      </div>
      <div class="app-navbar__provider-button-wrapper">
        <app-button
          class="app-navbar__provider-btn"
          type="button"
          :icon-left="$icons.metamask"
          scheme="flat"
          size="small"
          :text="
            provider.selectedAddress
              ? cropAddress(provider.selectedAddress)
              : $t('app-navbar.connect-provider-button')
          "
          @click="handleProviderClick"
        />
      </div>
    </template>
    <app-navigation-mobile
      class="app-navbar__navigation-mobile"
      :class="{ 'app-navbar__navigation-mobile--open': isBurgerOpen }"
      @close="isBurgerOpen = !isBurgerOpen"
    />
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
  text-transform: uppercase;
  align-items: center;
  margin: 0 auto;
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
}

.app-navbar__hamburger-button-icon {
  width: 100%;
  height: 100%;
}

.app-navbar__navigation-mobile {
  display: none;
  transform: translateX(-100%);
  transition: all 0.4s;

  @include respond-to(medium) {
    display: block;
  }

  &--open {
    transform: translateX(0);
  }
}
</style>
