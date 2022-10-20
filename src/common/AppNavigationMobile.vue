<script lang="ts" setup>
import { computed, defineEmits } from 'vue'
import { Icon, AppButton, AppLogo } from '@/common'
import { cropAddress } from '@/helpers'
import { ICON_NAMES } from '@/enums'
import { config } from '@config'
import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { useContext } from '@/composables'

enum EVENTS {
  close = 'close',
}

const SOCIAL_LINKS = [
  {
    iconName: ICON_NAMES.facebookCircle,
    link: config.FACEBOOK_LINK,
  },
  {
    iconName: ICON_NAMES.instagramCircle,
    link: config.INSTAGRAM_LINK,
  },
  {
    iconName: ICON_NAMES.youtubeCircle,
    link: config.YOUTUBE_LINK,
  },
  {
    iconName: ICON_NAMES.linkedinCircle,
    link: config.LINKEDIN_LINK,
  },
  {
    iconName: ICON_NAMES.telegramCircle,
    link: config.TELEGRAM_LINK,
  },
]

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { $t } = useContext()

const handleProviderClick = () => {
  if (provider.value.selectedAddress) {
    provider.value.disconnect()
    return
  }
  provider.value.connect()
}

const connectProviderButtonText = computed(() => {
  return provider.value.selectedAddress
    ? cropAddress(provider.value.selectedAddress)
    : $t('app-navbar.connect-provider-button')
})

const emit = defineEmits<{
  (e: EVENTS.close, isOpened: boolean): void
}>()

const closeSelf = () => {
  emit(EVENTS.close, false)
}
</script>

<template>
  <div class="app-navigation-mobile">
    <div class="app-navigation-mobile__header">
      <app-logo scheme="light" />
      <button
        class="app-navigation-mobile__close-btn"
        :aria-label="$t('app-navigation-mobile.close-burger-button')"
        @click="closeSelf"
      >
        <icon class="app-navigation-mobile__close-icon" :name="$icons.close" />
      </button>
    </div>
    <nav class="app-navigation-mobile__nav">
      <div class="app-navigation-mobile__links-wrap">
        <router-link
          class="app-navigation-mobile__text-link"
          :to="{ name: $routes.bookshelf }"
          @click="closeSelf"
        >
          {{ $t('app-navigation-mobile.bookshelf-link') }}
        </router-link>
        <router-link
          v-if="false"
          class="app-navigation-mobile__text-link"
          to="/"
          @click="closeSelf"
        >
          {{ $t('app-navigation-mobile.about-link') }}
        </router-link>
        <router-link
          class="app-navigation-mobile__text-link"
          :to="{ name: $routes.myNFTs }"
          @click="closeSelf"
        >
          {{ $t('app-navigation-mobile.my-nfts-link') }}
        </router-link>
      </div>
      <div class="app-navigation-mobile__provider-button-wrapper">
        <app-button
          class="app-navigation-mobile__provider-btn"
          type="button"
          :icon-left="$icons.metamask"
          size="small"
          :text="connectProviderButtonText"
          @click="handleProviderClick"
        />
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

<style lang="scss">
$header-height: toRem(70);

.app-navigation-mobile {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--background-quaternary);
  overflow-y: auto;
  z-index: var(--burger-z-index);
}

.app-navigation-mobile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(25) toRem(25);
  max-height: $header-height;
}

.app-navigation-mobile__nav {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  height: calc(100% - $header-height);
}

.app-navigation-mobile__links-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  text-align: end;
  justify-items: center;
  justify-content: center;
  margin-bottom: toRem(25);
  padding: 0 toRem(15);
}

.app-navigation-mobile__social {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: toRem(20);
  flex: 1;
}

.app-navigation-mobile__social-icon {
  display: flex;
  align-items: center;
  color: var(--text-primary-main);
  transition: color 0.3s;

  .app-navigation-mobile__social-link:hover > & {
    color: var(--text-primary-light);
  }
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
  color: var(--text-primary-invert-main);
  transition: color 0.3s;

  &:hover {
    color: var(--text-primary-light);
  }
}

.app-navigation-mobile__close-icon {
  transition: color 0.2s;

  @include respond-to(medium) {
    display: none;
  }

  @include respond-to(small) {
    display: none;
  }

  @include respond-to(xsmall) {
    display: none;
  }

  &:hover {
    color: var(--text-primary-light);
  }
}

.app-navigation-mobile__text-link {
  text-align: center;
  color: var(--text-secondary-main);
  text-decoration: none;
  font-family: var(--app-font-family);
  font-weight: 500;
  font-size: toRem(24);
  text-transform: uppercase;
  transition: color 0.2s;

  &:not(:first-child) {
    margin-top: toRem(20);
  }

  &:hover {
    color: var(--text-secondary-light);
  }
}

.app-navigation-mobile__provider-button-wrapper {
  display: flex;
  justify-content: center;
  flex: 1;
  max-height: toRem(50);
}

.app-navigation-mobile__provider-btn {
  text-transform: uppercase;
  font-family: var(--app-font-family);
  font-size: toRem(16);
  font-weight: 500;
  padding: toRem(9) toRem(16);
  color: var(--text-primary-invert-main);

  &:deep(.app-button__icon-left) {
    width: toRem(30);
    height: toRem(30);
  }
}
</style>
