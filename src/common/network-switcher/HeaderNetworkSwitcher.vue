<template>
  <drop-down
    v-if="provider.selectedAddress"
    class="header-network-switcher"
    :right="dropDownShift"
    :disabled="isSwitchingChain"
  >
    <template #head="{ menu }">
      <loader v-if="isLoadingNetworks" />
      <error-message
        v-else-if="isLoadFailed"
        class="header-network-switcher__error"
        :message="$t('networks.network-error')"
      />
      <section
        v-else
        class="header-network-switcher__wrapper"
        @click="menu.open"
      >
        <network-item
          modification="non-active"
          :name="pickedNetwork?.name"
          :scheme="getNetworkScheme(pickedNetwork?.chain_id)"
        />
      </section>
    </template>
    <template #default="{ menu }">
      <div class="header-network-switcher__body">
        <network-item
          v-for="network in networksStore.list"
          :key="network.id"
          :scheme="getNetworkScheme(network.chain_id)"
          :name="network.name"
          @click="changeNetwork(network.chain_id), menu.close()"
        />
      </div>
    </template>
  </drop-down>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { DropDown, NetworkItem, Loader, ErrorMessage } from '@/common'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { ErrorHandler, getNetworkScheme, switchNetwork } from '@/helpers'
import { ChainId } from '@/types'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

const { provider } = useWeb3ProvidersStore()
const { width } = useWindowSize()

const networksStore = useNetworksStore()

const isSwitchingChain = ref(false)
const isLoadingNetworks = ref(true)
const isLoadFailed = ref(false)

const dropDownShift = computed(() =>
  width.value <= WINDOW_BREAKPOINTS.medium ? 0 : 51,
)

const pickedNetwork = computed(() =>
  networksStore.getNetworkByID(Number(provider.chainId)),
)

const changeNetwork = async (chainID: ChainId) => {
  isSwitchingChain.value = true
  await switchNetwork(chainID)
  isSwitchingChain.value = false
}

onMounted(() => {
  try {
    networksStore.loadNetworks()
    isLoadingNetworks.value = false
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
})
</script>

<style lang="scss" scoped>
.header-network-switcher {
  --background-head-color: var(--background-primary);
  --background-body-color: var(--background-primary);
  --border-color: var(--text-secondary-main);
}

.header-network-switcher__wrapper {
  display: flex;
  align-items: center;
  height: toRem(52);
  padding: toRem(12) toRem(16);
  gap: toRem(12);
  border-radius: toRem(8);
  border: toRem(1) solid var(--border-color);
  background-color: var(--background-head-color);
  transition: 0.2s ease-in-out;
  transition-property: background-color;
  min-width: toRem(210);

  .app-navigation-mobile__network & {
    --background-head-color: transparent;
    --border-color: var(--white);
  }

  &:hover {
    cursor: pointer;
    --background-head-color: var(--background-tertiary);
  }

  .account--dark-mode & {
    --background-head-color: transparent;
    --border-color: var(--white);
  }
}

.header-network-switcher__body {
  width: toRem(206);
  background-color: var(--background-body-color);

  .app-navigation-mobile__network & {
    --background-body-color: var(--background-quaternary);
  }

  .account--dark-mode & {
    --background-body-color: var(--background-quaternary);
  }
}

.header-network-switcher__error {
  scale: 0.7;
}
</style>
