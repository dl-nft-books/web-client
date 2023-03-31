<template>
  <div class="browser-support">
    <modal v-model:is-shown="isModalShown">
      <template #default="{ modal }">
        <main class="browser-support__main">
          <app-button
            class="browser-support__close-btn"
            :icon-right="$icons.x"
            color="default"
            scheme="default"
            size="x-small"
            @click="modal.close"
          />
          <h4>
            {{ $t('browser-support.title') }}
          </h4>
          <p class="browser-support__subtitle">
            {{ $t('browser-support.subtitle') }}
          </p>
          <div class="browser-support__icons">
            <icon :name="$icons.chrome" />
            <icon :name="$icons.opera" />
            <icon :name="$icons.operaGx" />
            <icon :name="$icons.microsoftEdge" />
            <icon :name="$icons.mozilla" />
            <icon :name="$icons.brave" />
          </div>
          <app-button
            size="small"
            class="browser-support__submit-btn"
            :text="$t('browser-support.submit-btn')"
            @click="modal.close(), submit()"
          />
        </main>
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Modal, AppButton, Icon } from '@/common'
import {
  isChromeBrowser,
  isEdgeBrowser,
  isFirefoxBrowser,
  isIosBrowser,
  isOperaBrowser,
} from '@/helpers'

const STORAGE_KEY = 'hasUserAcceptedBrowserSupport'

const isModalShown = ref(false)

const submit = () => {
  localStorage.setItem(STORAGE_KEY, '+')
}

const isSupportedBrowser = () =>
  isChromeBrowser() ||
  isEdgeBrowser() ||
  isFirefoxBrowser() ||
  isOperaBrowser() ||
  isIosBrowser()

onMounted(() => {
  const hasAccepted = localStorage.getItem(STORAGE_KEY)

  if (isSupportedBrowser() || hasAccepted) return

  isModalShown.value = true
})
</script>

<style lang="scss" scoped>
.browser-support__main {
  background-color: var(--background-primary);
  padding: toRem(50) toRem(40) toRem(35) toRem(40);
  border-radius: toRem(12);
  max-width: toRem(450);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  text-align: center;
  align-items: center;
  position: relative;

  @include respond-to(small) {
    padding-left: toRem(25);
    padding-right: toRem(25);
  }
}

.browser-support__subtitle {
  line-height: 130%;
}

.browser-support__icons {
  --icon-size: #{toRem(40)};

  display: flex;
  justify-content: center;
  gap: toRem(20);

  & > * {
    max-width: var(--icon-size);
    max-height: var(--icon-size);
  }
}

.browser-support__submit-btn {
  text-transform: uppercase;
  margin-top: toRem(30);
}

.browser-support__close-btn {
  transition: 0.2s ease-in-out;
  transition-property: transform;
  position: absolute;
  top: toRem(15);
  right: toRem(5);

  &:hover {
    transform: rotate(90deg);
  }
}
</style>
