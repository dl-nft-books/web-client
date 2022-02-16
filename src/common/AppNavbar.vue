<template>
  <div class="app-navbar">
    <app-logo class="app-navbar__logo" />
  </div>
</template>

<script lang="ts">
import AppLogo from './AppLogo.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'app-navbar',
  components: { AppLogo },
  setup () {

    return {}
  },
})
</script>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  background: var(--app-navbar-bg);
  border-bottom: var(--app-navbar-border);

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__logo {

  @include respond-to(xsmall) {
    width: 100%;
    margin-bottom: toRem(24);
  }
}

.app-navbar__connect-wallet {
  margin-right: toRem(16);
}

.app-navbar__auth-btn {

  @include respond-to(tablet) {
    margin-left: auto;
    order: 2;
  }

  @include respond-to(xsmall) {
    width: 50%;
    margin-right: 0;
  }
}

.app-navbar__links-section {
  display: flex;
  align-items: center;
  margin: 0 auto;

  @include respond-to(tablet) {
    width: 100%;
    order: 3;
  }

  @include respond-to(xsmall) {
    flex-direction: column;
    align-items: flex-start;
    width: 50%;
    order: 1;
  }
}

.app-navbar__link {
  transition: 0.35s ease-in-out;

  &:not(:last-child) {
    margin-right: toRem(64);

    @include respond-to(xsmall) {
      margin-right: 0;
      padding: toRem(6) 0;
    }
  }

  &.router-link-active {
    color: var(--app-navbar-active);
  }
}
</style>