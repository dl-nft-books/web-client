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
    <browser-support />
  </div>
</template>

<script lang="ts" setup>
import { AppNavbar, AppFooter, BrowserSupport } from '@/common'

import { ErrorHandler } from '@/helpers/error-handler'
import { ref, watch } from 'vue'
import { useNotifications } from '@/composables'
import { config } from '@config'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { Bus } from '@/helpers'

const isAppInitialized = ref(false)
const web3Store = useWeb3ProvidersStore()
const networkStore = useNetworksStore()

const body = ref<HTMLBodyElement | null>(document.querySelector('body'))

const init = async () => {
  try {
    useNotifications()
    await networkStore.loadNetworks()
    await web3Store.detectProviders()

    await web3Store.init(networkStore.list.map(el => el.chain_id))

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
  scrollState => (isScrollEnabled.value = Boolean(scrollState)),
)

watch(isScrollEnabled, () => {
  if (!body.value) return

  if (!isScrollEnabled.value) {
    body.value.classList.add('body-scroll-disabled')
    return
  }

  body.value.classList.remove('body-scroll-disabled')
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
