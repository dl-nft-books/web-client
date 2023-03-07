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
import { Bus } from '@/helpers'

const isAppInitialized = ref(false)
const web3Store = useWeb3ProvidersStore()

const init = async () => {
  try {
    useNotifications()
    await web3Store.detectProviders()

    await web3Store.init()

    document.title = config.APP_NAME
  } catch (error) {
    ErrorHandler.process(error)
  }
  isAppInitialized.value = true
}

init()

const isScrollEnabled = ref(true)
Bus.on(Bus.eventList.toggleScroll, (payload: unknown) => {
  isScrollEnabled.value = Boolean(payload)
})
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
