<template>
  <drop-down
    v-if="provider.address"
    :class="networkSwitcherClasses"
    :right="dropDownShift"
    :disabled="isSwitchingChain"
  >
    <template #head="{ menu }">
      <div class="header-network-switcher__wrapper" @click="menu.open">
        <network-item
          :modification="`non-active ${modification}`"
          :name="networkName"
          :scheme="getNetworkScheme(pickedNetwork?.chain_id)"
        />
      </div>
    </template>
    <template #default="{ menu }">
      <div class="header-network-switcher__body">
        <network-item
          v-for="network in networksStore.list"
          :key="network.id"
          :modification="modification"
          :scheme="getNetworkScheme(network.chain_id)"
          :name="network.name"
          @click="changeNetwork(network.chain_id), menu.close()"
        />
      </div>
    </template>
  </drop-down>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { DropDown, NetworkItem } from '@/common'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { getNetworkScheme, switchNetwork } from '@/helpers'
import { ChainId } from '@distributedlab/w3p'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

type MODIFICATIONS = 'dark-mode' | 'default'

const props = withDefaults(
  defineProps<{
    modification?: MODIFICATIONS
  }>(),
  { modification: 'default' },
)

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)
const { width } = useWindowSize()

const networksStore = useNetworksStore()

const isSwitchingChain = ref(false)

const networkSwitcherClasses = computed(() => [
  'header-network-switcher',
  `header-network-switcher--${props.modification}`,
])

const dropDownShift = computed(() =>
  width.value <= WINDOW_BREAKPOINTS.medium ? 0 : 81,
)

const pickedNetwork = computed(() =>
  networksStore.getNetworkByID(Number(provider.value.chainId)),
)

const networkName = computed(() =>
  pickedNetwork.value
    ? pickedNetwork.value.name
    : networksStore.getChainByID(Number(provider.value.chainId))?.name,
)

const changeNetwork = async (chainID: ChainId) => {
  isSwitchingChain.value = true
  await switchNetwork(chainID)
  isSwitchingChain.value = false
}
</script>

<style lang="scss" scoped>
.header-network-switcher {
  --background-head-color: var(--background-primary);
  --background-body-color: var(--background-primary);
  --border-color: var(--text-secondary-main);
  --background-hover-color: var(--background-primary-light);

  &--dark-mode {
    --background-head-color: transparent;
    --background-body-color: var(--background-secondary);
    --border-color: var(--white);
    --background-hover-color: rgba(var(--drop-down-shadow-rgb), 0.2);
  }
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

  &:hover {
    cursor: pointer;
    --background-head-color: var(--background-hover-color);
  }
}

.header-network-switcher__body {
  width: toRem(206);
  background-color: var(--background-body-color);
}

.header-network-switcher__error {
  scale: 0.7;
}
</style>
