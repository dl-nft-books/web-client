<script lang="ts" setup>
import { Icon } from '@/common'
import { AppButton } from '@/common'
</script>

<template>
  <header class="app-header">
    <router-link
      :to="$routes.home"
      class="app-header__logo-wrapper"
    >
      <icon
        class="app-header__book-icon"
        :name="$icons.book"
      />
      <icon
        class="app-header__store-text-icon"
        :name="$icons.distributedStoreText"
      />
    </router-link>
    <div class="app-header__links-wrapper">
      <router-link
        class="app-header__text-link"
        to="/"
      >
        {{ $t('header.bookshelf-text') }}
      </router-link>
      <router-link
        v-if="false"
        class="app-header__text-link"
        to="/"
      >
        {{ $t('header.my-nfts-text') }}
      </router-link>
      <router-link
        class="app-header__text-link"
        to="/"
      >
        {{ $t('header.about-project-text') }}
      </router-link>
    </div>
    <div class="app-header__metamask-button-wrapper">
      <app-button
        class="app-header__metamask-button"
        type="button"
        :icon-left="$icons.metamask"
        scheme="flat"
        :text="$t('header.metamask-button-text')"
      />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem var(--app-padding-right) 3rem var(--app-padding-left);
  height: fit-content;
}

.app-header__logo-wrapper {
  display: flex;
  align-items: center;
  color: var(--app-header-icon);
  justify-self: flex-end;
}

.app-header__book-icon {
  max-width: 3rem;
  max-height: 4.5rem;
  margin-right: 1rem;
}

.app-header__store-text-icon {
  max-width: 20rem;
  max-height: 1.5rem;
}

.app-header__links-wrapper {
  justify-self: center;
  text-transform: uppercase;
}

.app-header__text-link {
  color: var(--app-header-text);
  text-decoration: none;
  font-family: var(--app-font-family);
  font-weight: 500;
  font-size: 1.6rem;

  &:nth-child(2n) {
    margin: 0 5rem;
  }
}

.app-header__metamask-button {
  font-family: var(--app-font-family);
  color: var(--app-header-text);
  font-size: 1.6rem;
  text-transform: uppercase;
  font-weight: 500;
}
</style>
