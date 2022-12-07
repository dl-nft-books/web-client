<template>
  <div class="network-switcher">
    <app-button
      modification="switcher"
      class="network-switcher__item"
      :class="{
        'network-switcher__item--picked': pickedNetwork === NETWORKS.POLYGON,
      }"
      @click="changeNetwork(NETWORKS.POLYGON)"
      :icon-left="$icons.polygon"
      icon-size="large"
    />
    <!-- Will be uncommented with release of switching networks -->
    <!-- <app-button
      modification="switcher"
      class="network-switcher__item"
      :class="{
        'network-switcher__item--picked': pickedNetwork === NETWORKS.ETHEREUM,
      }"
      @click="changeNetwork(NETWORKS.ETHEREUM)"
      :icon-left="$icons.ethereum"
      icon-size="large"
    />
    <app-button
      modification="switcher"
      class="network-switcher__item"
      :class="{
        'network-switcher__item--picked': pickedNetwork === NETWORKS.Q,
      }"
      @click="changeNetwork(NETWORKS.Q)"
      :icon-left="$icons.q"
      icon-size="large"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppButton } from '@/common'
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

  /* width will be 210 */
  width: toRem(70);
  height: toRem(52);
  position: relative;
  z-index: var(--page-index);
}

.network-switcher__item {
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
</style>
