<script lang="ts" setup>
import { Icon } from '@/common'
import { AppLogo } from '@/common'
import { ICON_NAMES } from '@/enums'
import { config } from '@config'

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
</script>

<template>
  <footer class="app-footer">
    <hr class="app-footer__line" />
    <div class="app-footer__content">
      <app-logo scheme="light" />
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
          <icon class="app-footer__social-link-icon" :name="social.iconName" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  --first: 1;

  padding: toRem(40) var(--app-padding-right) toRem(40) var(--app-padding-left);
  background: var(--background-secondary);
  z-index: var(--first);
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

  @include respond-to(medium) {
    flex-direction: column;
    row-gap: toRem(25);
  }
}

.app-footer__links-wrapper {
  display: flex;
  margin: 0 auto;
  text-transform: uppercase;
  column-gap: toRem(60);
  text-align: center;
}

.app-footer__text-link {
  color: var(--text-primary-invert-main);
  text-decoration: none;
  font-family: var(--app-font-family);
  font-weight: 500;
  font-size: toRem(16);
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
  color: var(--background-secondary);
}
</style>
