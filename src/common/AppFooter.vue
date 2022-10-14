<script lang="ts" setup>
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

const SOCIAL_LINKS = [
  {
    iconName: ICON_NAMES.facebookCircle,
    link: '/',
  },
  {
    iconName: ICON_NAMES.instagramCircle,
    link: '/',
  },
  {
    iconName: ICON_NAMES.youtubeCircle,
    link: '/',
  },
  {
    iconName: ICON_NAMES.linkedinCircle,
    link: '/',
  },
  {
    iconName: ICON_NAMES.telegramCircle,
    link: '/',
  },
]

</script>

<template>
  <footer class="app-footer">
    <hr class="app-footer__line" />
    <div class="app-footer__content">
      <router-link :to="$routes.home" class="app-footer__logo-wrapper">
        <icon class="app-footer__book-icon" :name="$icons.book" />
        <icon
          class="app-footer__store-text-icon"
          :name="$icons.distributedStoreText"
        />
      </router-link>
      <div class="app-footer__links-wrapper">
        <router-link class="app-footer__text-link" to="/">
          {{ $t('app-footer.faq-link') }}
        </router-link>
        <router-link class="app-footer__text-link" to="/">
          {{ $t('app-footer.help-link') }}
        </router-link>
        <router-link class="app-footer__text-link" to="/">
          {{ $t('app-footer.blog-link') }}
        </router-link>
      </div>
      <div class="app-footer__social-links">
        <a
          class="app-footer__social-link"
          target="_blank"
          rel="noopener"
          v-for="(social, idx) in SOCIAL_LINKS"
          :key="idx"
          :href="social.link"
        >
          <icon
            class="app-footer__social-link-icon"
            :name="social.iconName"
          />
        </a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  padding: toRem(40) var(--app-padding-right) toRem(40) var(--app-padding-left);
  background: var(--footer-bg);
}

.app-footer__line {
  height: toRem(1);
  border: none;
  background: var(--primary-main);
}

.app-footer__content {
  display: flex;
  align-items: center;
  margin-top: toRem(30);
}

.app-footer__logo-wrapper {
  display: flex;
  align-items: center;
  color: var(--text-primary-invert-main);
}

.app-footer__book-icon {
  max-width: toRem(30);
  max-height: toRem(45);
  margin-right: toRem(10);
  color: var(--text-primary-invert-main);
}

.app-footer__store-text-icon {
  max-width: toRem(200);
  max-height: toRem(15);
  color: var(--text-primary-invert-main);
}

.app-footer__links-wrapper {
  display: flex;
  margin: 0 auto;
  justify-self: center;
  text-transform: uppercase;
  column-gap: toRem(60);
}

.app-footer__text-link {
  color: var(--text-primary-invert-main);
  text-decoration: none;
  font-family: var(--app-font-family);
  font-weight: 500;
  font-size: toRem(14);
}

.app-footer__social-links {
  display: flex;
  justify-self: flex-end;
  column-gap: toRem(15);
}

.app-footer__social-link {
  width: toRem(32);
  height: toRem(32);
}

.app-footer__social-link-icon {
  color: var(--footer-bg);
}
</style>
