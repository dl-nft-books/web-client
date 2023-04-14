<template>
  <footer class="app-footer">
    <hr class="app-footer__line" />
    <div class="app-footer__content">
      <app-logo scheme="light" />
      <div class="app-footer__links-wrapper">
        <app-button
          :route="{ name: $routes.faq }"
          :text="$t('app-footer.faq-link')"
          scheme="default"
          class="app-footer__text-link"
        />

        <app-button
          :href="$config.HELP_LINK"
          :text="$t('app-footer.help-link')"
          scheme="default"
          class="app-footer__text-link"
        />
        <app-button
          :href="$config.DOCS_LINK"
          :text="$t('app-footer.docs-link')"
          scheme="default"
          class="app-footer__text-link"
        />
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

<script lang="ts" setup>
import { Icon, AppLogo, AppButton } from '@/common'
import { ICON_NAMES } from '@/enums'
import { config } from '@config'

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
  {
    iconName: ICON_NAMES.instagramCircle,
    link: config.INSTAGRAM_LINK,
  },
]
</script>

<style lang="scss" scoped>
.app-footer {
  width: 100%;
  padding: toRem(40) var(--app-padding-right) toRem(40) var(--app-padding-left);
  background: var(--background-primary-main);
  z-index: var(--z-index-layer-1);
  position: relative;
}

.app-footer__line {
  height: toRem(1);
  border: none;
  background: var(--primary-main);
}

.app-footer__content {
  display: flex;
  align-items: center;
  margin-top: toRem(20);

  @include respond-to(medium) {
    flex-direction: column;
    row-gap: toRem(25);
  }
}

.app-footer__links-wrapper {
  display: flex;
  margin: 0 auto;
  text-transform: uppercase;
  column-gap: toRem(30);
  text-align: center;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
  }
}

.app-footer__text-link {
  font-weight: 500;
  color: var(--text-primary-light);
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
  color: var(--background-primary-main);
}
</style>
