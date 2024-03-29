<template>
  <div
    class="app-navigation-mobile"
    :class="{ 'app-navigation-mobile--open': isShowSidebar }"
  >
    <div class="app-navigation-mobile__header">
      <app-logo scheme="light" @hide-sidebar="hideSidebar" />
      <button
        class="app-navigation-mobile__close-btn"
        type="button"
        :aria-label="$t('app-navigation-mobile.close-burger-button')"
        @click="hideSidebar"
      >
        <icon class="app-navigation-mobile__close-icon" :name="$icons.close" />
      </button>
    </div>
    <nav class="app-navigation-mobile__nav">
      <div class="app-navigation-mobile__links-wrap">
        <router-link
          class="app-navigation-mobile__text-link"
          :to="{ name: $routes.bookshelf }"
          @click="hideSidebar"
        >
          {{ $t('app-navigation-mobile.bookshelf-link') }}
        </router-link>
        <router-link
          class="app-navigation-mobile__text-link"
          :to="{ name: $routes.myNfts }"
          @click="hideSidebar"
        >
          {{ $t('app-navigation-mobile.my-nfts-link') }}
        </router-link>
        <router-link
          class="app-navigation-mobile__text-link"
          :to="{ name: $routes.aboutUs }"
          @click="hideSidebar"
        >
          {{ $t('app-navigation-mobile.about-link') }}
        </router-link>
      </div>
      <div class="app-navigation-mobile__provider-button-wrapper">
        <app-button
          class="app-navigation-mobile__provider-btn"
          type="button"
          :icon-left="$icons.metamask"
          size="small"
          :disabled="provider.address"
          :text="connectProviderButtonText"
          @click="provider.connect"
        />
        <div class="app-navigation-mobile__network">
          <network-switcher modification="dark-mode" />
        </div>
      </div>

      <div class="app-navigation-mobile__social">
        <a
          v-for="social in SOCIAL_LINKS"
          :key="social.link"
          :href="social.link"
          target="_blank"
          rel="noopener"
          class="app-navigation-mobile__social-link"
        >
          <icon
            class="app-navigation-mobile__social-icon"
            :name="social.iconName"
          />
        </a>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Icon, AppButton, AppLogo, NetworkSwitcher } from '@/common'
import { Bus, cropAddress } from '@/helpers'
import { ICON_NAMES } from '@/enums'
import { config } from '@config'
import { useWeb3ProvidersStore } from '@/store'
import { useI18n } from 'vue-i18n'

const SOCIAL_LINKS = [
  {
    iconName: ICON_NAMES.facebookCircle,
    link: config.FACEBOOK_LINK,
  },
  {
    iconName: ICON_NAMES.youtubeCircle,
    link: config.YOUTUBE_LINK,
  },
  {
    iconName: ICON_NAMES.linkedinCircle,
    link: config.LINKEDIN_LINK,
  },
]
const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const { t } = useI18n()

const isShowSidebar = ref(false)

const connectProviderButtonText = computed(() => {
  return provider.value.address
    ? cropAddress(provider.value.address)
    : t('app-navbar.connect-provider-button')
})

Bus.on(Bus.eventList.openSidebar, () => {
  showSidebar()
})

const showSidebar = () => {
  isShowSidebar.value = true
}

const hideSidebar = () => {
  isShowSidebar.value = false
}
</script>

<style lang="scss">
$z-local: 10;

.app-navigation-mobile {
  display: none;
  transform: translateX(-100%);
  transition: all 0.4s;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--background-primary-light);
  overflow-y: auto;
  z-index: $z-local;

  &--open {
    transform: translateX(0);
  }

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
  }
}

.app-navigation-mobile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(30) var(--app-padding-right) toRem(30) var(--app-padding-left);
}

.app-navigation-mobile__nav {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  margin: 0 auto;
  flex: 1;
}

.app-navigation-mobile__links-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: end;
  justify-items: center;
  justify-content: center;
  padding: 0 toRem(15);
}

.app-navigation-mobile__social {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(20);
  flex: 1;
}

.app-navigation-mobile__social-icon {
  display: flex;
  align-items: center;
  color: var(--background-primary-light);
  transition: color 0.3s;
}

.app-navigation-mobile__social-link {
  width: toRem(26);
  height: toRem(26);
  display: flex;

  &:not(:first-child) {
    margin-left: toRem(26);
  }
}

.app-navigation-mobile__close-btn {
  width: toRem(20);
  height: toRem(20);
  color: var(--text-primary-light);
  transition: color 0.3s;
}

.app-navigation-mobile__close-icon {
  transition: color 0.2s;

  @include respond-to(medium) {
    display: none;
  }
}

.app-navigation-mobile__text-link {
  font-size: toRem(24);
  line-height: 120%;
  text-align: center;
  color: var(--text-secondary-main);
  text-transform: uppercase;
  transition: color 0.2s;

  &:not(:first-child) {
    margin-top: toRem(20);
  }
}

.app-navigation-mobile__provider-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: toRem(20);
  flex: 1;
}

.app-navigation-mobile__network {
  position: relative;
}

.app-navigation-mobile__provider-btn {
  text-transform: uppercase;
  padding: toRem(9) toRem(16);
  font-weight: 500;
  color: var(--text-primary-light);

  &:deep(.app-button__icon-left) {
    width: toRem(30);
    height: toRem(30);
  }
}
</style>
