<template>
  <div
    v-if="isAppInitialized"
    class="app__container"
    :class="{ 'app__container--scroll-disabled': !isScrollEnabled }"
  >
    <app-navbar />
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component class="app__main" :is="Component" />
      </transition>
    </router-view>
    <app-footer />
  </div>
</template>

<script lang="ts" setup>
import { AppNavbar, AppFooter } from '@/common'

import { ErrorHandler } from '@/helpers/error-handler'
import { ref } from 'vue'
import { useNotifications } from '@/composables'
import { config } from '@config'
import { useWeb3ProvidersStore } from '@/store'
import { PROVIDERS } from '@/enums'
import { Bus } from '@/helpers'
import { DesignatedProvider } from '@/types'

const isAppInitialized = ref(false)
const web3Store = useWeb3ProvidersStore()

const init = async () => {
  try {
    useNotifications()
    await web3Store.detectProviders()

    // temporary
    const metamaskProvider = web3Store.providers.find(
      provider => provider.name === PROVIDERS.metamask,
    )

    const metamaskFallBack: DesignatedProvider = {
      name: PROVIDERS.metamaskFallback,
      instance: undefined,
    }

    if (metamaskProvider) {
      await web3Store.provider.init(metamaskProvider)
    } else {
      /* if user has no extension or mobile metamask app we are using fallback 
         provider to redirect him to app or to page where he can download it */
      const fallbackProvider = web3Store.providers.find(
        provider => provider.name === PROVIDERS.fallback,
      )

      if (fallbackProvider) await web3Store.provider.init(metamaskFallBack)
    }

    document.title = config.APP_NAME
  } catch (error) {
    ErrorHandler.process(error)
  }
  isAppInitialized.value = true
}

init()

const isScrollEnabled = ref(true)
Bus.on(
  Bus.eventList.toggleScroll,
  () => (isScrollEnabled.value = !isScrollEnabled.value),
)
</script>

<style lang="scss" scoped>
.app__container {
  display: flex;
  flex-direction: column;
  flex: 1;

  &--scroll-disabled {
    height: vh(100);
    flex: unset;
    overflow: hidden;
  }
}

.app__main {
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
}

.fade-enter-active {
  animation: fade-in 0.25s;
}

.fade-leave-active {
  animation: fade-in 0.25s reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
