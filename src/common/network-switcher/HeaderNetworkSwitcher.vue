<template>
  <drop-down v-if="provider.selectedAddress" :right="81">
    <template #head="{ menu }">
      <section class="header-network-switcher" @click="menu.open">
        <network-item modification="non-active" :scheme="pickedNetwork" />
      </section>
    </template>
    <template #default="{ menu }">
      <div class="header-network-switcher__body">
        <network-item
          @network-change="changeNetwork(NETWORKS.POLYGON, menu.close)"
        />
        <network-item
          :scheme="NETWORKS.ETHEREUM"
          @network-change="changeNetwork(NETWORKS.ETHEREUM, menu.close)"
        />
        <network-item
          :scheme="NETWORKS.Q"
          @network-change="changeNetwork(NETWORKS.Q, menu.close)"
        />
      </div>
    </template>
  </drop-down>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { DropDown, NetworkItem } from '@/common'
import { NETWORKS } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ErrorHandler } from '@/helpers'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const pickedNetwork = ref<NETWORKS>(NETWORKS.POLYGON)

const changeNetwork = async (network: NETWORKS, closeDropDown: () => void) => {
  try {
    //TODO network changing

    // await provider.value.addChain(
    //   1,
    //   'Ethereum Mainnet',
    //   'https://polygon-rpc.com/',
    // )
    pickedNetwork.value = network
    closeDropDown()
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.header-network-switcher {
  display: flex;
  align-items: center;
  height: toRem(52);
  padding: toRem(12) toRem(16);
  gap: toRem(12);
  background-color: var(--background-primary);
  border-radius: toRem(8);
  border: toRem(1) solid var(--text-secondary-main);
  transition: 0.2s ease-in-out;
  transition-property: background-color;
  width: toRem(210);

  &:hover {
    cursor: pointer;
    background-color: var(--background-tertiary);
  }

  .account--dark-mode & {
    background-color: transparent;
    border: toRem(1) solid var(--white);
  }
}

.header-network-switcher__body {
  width: toRem(206);
  background-color: var(--background-primary);

  .account--dark-mode & {
    background-color: var(--background-quaternary);
  }
}
</style>
