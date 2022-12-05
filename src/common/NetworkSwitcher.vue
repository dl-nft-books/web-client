<template>
  <div class="network-switcher">
    <button
      class="network-switcher__item"
      :class="{
        'network-switcher__item--picked': pickedNetwork === NETWORKS.POLYGON,
      }"
      @click="changeNetwork(NETWORKS.POLYGON)"
    >
      <icon class="network-switcher__icon" :name="$icons.polygon" />
    </button>
    <button
      class="network-switcher__item"
      :class="{
        'network-switcher__item--picked': pickedNetwork === NETWORKS.ETHEREUM,
      }"
      @click="changeNetwork(NETWORKS.ETHEREUM)"
    >
      <icon :name="$icons.ethereum" />
    </button>
    <button
      class="network-switcher__item"
      :class="{
        'network-switcher__item--picked': pickedNetwork === NETWORKS.Q,
      }"
      @click="changeNetwork(NETWORKS.Q)"
    >
      <icon :name="$icons.q" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@/common'
import { NETWORKS } from '@/enums'

const pickedNetwork = ref<NETWORKS>(NETWORKS.POLYGON)

//TODO network changing

const changeNetwork = (network: NETWORKS) => {
  pickedNetwork.value = network
}
</script>

<style lang="scss" scoped>
.network-switcher {
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

.network-switcher__item {
  --bg-picked-color: #{rgba(var(--white-rgb), 0.2)};

  padding: toRem(10);
  transition: 0.2s ease-in-out;
  transition-property: opacity background-color;

  &:first-child {
    border-radius: toRem(8) 0 0 toRem(8);
  }

  &:last-child {
    border-radius: 0 toRem(8) toRem(8) 0;
  }

  &:hover {
    cursor: pointer;
    background-color: var(--bg-picked-color);
  }

  &--picked {
    background-color: var(--bg-picked-color);
  }
}

.network-switcher__icon {
  color: var(--primary-main);
}
</style>
