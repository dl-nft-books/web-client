<template>
  <div class="book-chain-info">
    <p class="book-chain-info__title">
      {{ $t('book-chain-info.title-part-1') }}
      <span class="book-chain-info__chain">{{ targetChainName }}</span>

      {{ $t('book-chain-info.title-part-2') }}
      <span class="book-chain-info__chain">{{ sourceChainName }}</span>
    </p>
    <p>
      {{ $t('book-chain-info.subtitle') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChainId } from '@distributedlab/w3p'
import { useNetworksStore } from '@/store'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  sourceChain: ChainId
  targetChain: ChainId
}>()

const { t } = useI18n()

const networkStore = useNetworksStore()

const sourceChainName = computed(
  () =>
    networkStore.getChainByID(Number(props.sourceChain))?.name ??
    t('networks.unsupported'),
)

const targetChainName = computed(
  () =>
    networkStore.getChainByID(Number(props.targetChain))?.name ??
    t('networks.unsupported'),
)
</script>

<style lang="scss" scoped>
.book-chain-info__title {
  line-height: toRem(20);
}

.book-chain-info__chain {
  color: var(--primary-main);
}
</style>
