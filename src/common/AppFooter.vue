<script lang="ts" setup>
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

const SOCIAL_LINKS = [
  {
    name: ICON_NAMES.facebook,
    link: '/',
  },
  {
    name: ICON_NAMES.instagram,
    link: '/',
  },
  {
    name: ICON_NAMES.youtube,
    link: '/',
  },
  {
    name: ICON_NAMES.linkedin,
    link: '/',
  },
  {
    name: ICON_NAMES.telegram,
    link: '/',
  },
]
</script>

<template>
<footer class="app-footer">
  <hr class="app-footer__line"/>
  <div class="app-footer__content">
    <router-link
      :to="$routes.home"
      class="app-footer__logo-wrapper"
    >
      <icon
        class="app-footer__book-icon"
        :name="$icons.book"
      />
      <icon
        class="app-footer__store-text-icon"
        :name="$icons.distributedStoreText"
      />
    </router-link>
    <div class="app-footer__links-wrapper">
      <router-link
        class="app-footer__text-link"
        to="/"
      >
        {{ $t('footer.faq-text') }}
      </router-link>
      <router-link
        class="app-footer__text-link"
        to="/"
      >
        {{ $t('footer.help-and-support-text') }}
      </router-link>
      <router-link
        class="app-footer__text-link"
        to="/"
      >
        {{ $t('footer.blog-text') }}
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
          :name="social.name"
        />
      </a>
    </div>
  </div>
</footer>
</template>

<style lang="scss" scoped>
.app-footer {
  padding: 4rem var(--app-padding-right) 4rem var(--app-padding-left);
  background: var(--app-footer-background);
}

.app-footer__line {
  height: 0.1rem;
  border: none;
  background: var(--app-footer-line);
}

.app-footer__content {
  display: flex;
  align-items: center;
  margin-top: 3rem;
}

.app-footer__logo-wrapper {
  display: flex;
  align-items: center;
  color: var(--app-footer-icon);
  justify-self: flex-end;
}

.app-footer__book-icon {
  max-width: 3rem;
  max-height: 4.5rem;
  margin-right: 1rem;
  color: var(--app-footer-icon);
}

.app-footer__store-text-icon {
  max-width: 20rem;
  max-height: 1.5rem;
  color: var(--app-footer-icon);
}

.app-footer__links-wrapper {
  justify-self: center;
  text-transform: uppercase;
}

.app-footer__text-link {
  color: var(--app-footer-text);
  text-decoration: none;
  font-family: var(--app-font-family);
  font-weight: 500;
  font-size: 1.4rem;

  &:nth-child(2n) {
    margin: 0 5rem;
  }
}

.app-footer__social-links {
  display: flex;
  justify-self: flex-end;
}

.app-footer__social-link {
  width: 3.2rem;
  height: 3.2rem;

  &:nth-child(2n) {
    margin: 0 1.5rem;
  }
}

.app-footer__social-link-icon {
  color: var(--app-footer-social-links-icons);
}
</style>
