<template>
  <div class="web3-page">
    <app-button
      v-for="provider in providers"
      :key="provider.name"
      :text="provider.name"
    />
  </div>
</template>

<script lang="ts">
import { AppButton } from '@/common'

import { computed, defineComponent } from 'vue'
import { useWeb3ProvidersStore } from '@/store'

export default defineComponent({
  name: 'web3-page',
  components: { AppButton },
  setup() {
    const web3Store = useWeb3ProvidersStore()

    web3Store.detectProviders()

    const providers = computed(() => web3Store.providers)

    return {
      providers,
    }
  },
})
</script>
