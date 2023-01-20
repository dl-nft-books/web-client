<template>
  <div v-if="!isSmallScreen" class="bookshelf-network-switcher">
    <app-button
      v-for="network in networkStore.list"
      :key="network.id"
      modification="switcher"
      icon-size="large"
      class="bookshelf-network-switcher__item"
      :class="{
        'bookshelf-network-switcher__item--picked':
          chainId === network.chain_id,
      }"
      :icon-left="getIconByScheme(getNetworkScheme(network.chain_id))"
      @click="changeNetwork(getNetworkScheme(network.chain_id))"
    />
  </div>
  <template v-else>
    <select-field
      v-model="chainIdValue"
      class="bookshelf-network-switcher__mobile"
      :value-options="selectOptions"
    />
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AppButton } from '@/common'
import { NETWORKS, WINDOW_BREAKPOINTS } from '@/enums'
import { ChainId } from '@/types'
import {
  getChainFromNetwork,
  getNetworkScheme,
  getIconByScheme,
} from '@/helpers'
import { useNetworksStore } from '@/store'
import { SelectField } from '@/fields'
import { useWindowSize } from '@vueuse/core'
import { useContext } from '@/composables'

const networkStore = useNetworksStore()
const { width } = useWindowSize()
const { $t } = useContext()

const emit = defineEmits<{
  (event: 'update:chain-id', value: ChainId): void
}>()

const props = defineProps<{
  chainId: ChainId
}>()

const chainIdValue = ref<ChainId>(props.chainId.toString())

const isSmallScreen = computed(() => width.value <= WINDOW_BREAKPOINTS.medium)

const selectOptions = computed(() => [
  {
    label: $t('networks.all-tokens-lbl'),
    value: '0',
  },
  ...networkStore.list.map(network => ({
    label: network.name,
    value: network.chain_id,
  })),
])

const changeNetwork = (network: NETWORKS) => {
  emit('update:chain-id', Number(getChainFromNetwork(network)))
}

watch(chainIdValue, () => {
  emit('update:chain-id', Number(chainIdValue.value))
})
</script>

<style lang="scss" scoped>
.bookshelf-network-switcher {
  display: flex;
  justify-content: space-between;
  border-radius: toRem(8);
  border: toRem(1) solid rgba(var(--white-rgb), 0.5);
  background-color: var(--black);
  width: toRem(210);
  height: toRem(52);
  position: relative;
  z-index: var(--page-index);
}

.bookshelf-network-switcher__item {
  --bg-picked-color: #{rgba(var(--white-rgb), 0.2)};

  padding: toRem(5);
  color: var(--primary-main);
  width: 100%;

  &:first-child {
    border-radius: toRem(8) 0 0 toRem(8);
  }

  &:last-child {
    border-radius: 0 toRem(8) toRem(8) 0;
  }

  &--picked {
    background-color: var(--bg-picked-color);
  }
}

.bookshelf-network-switcher__mobile {
  flex: unset;
  width: 50%;
  position: relative;
  z-index: var(--nav-bar-index);
  color: var(--text-primary-invert-main);
}
</style>
