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
import { ChainId } from '@/types'
import { useI18n } from 'vue-i18n'
import { ETHEREUM_CHAINS, POLYGON_CHAINS, Q_CHAINS } from '@/enums'

type SupportedChain = ETHEREUM_CHAINS | POLYGON_CHAINS | Q_CHAINS

const props = defineProps<{
  sourceChain: ChainId
  targetChain: ChainId
}>()

const { t } = useI18n()

const getChainName = (chain: SupportedChain) => {
  switch (chain) {
    case ETHEREUM_CHAINS.ethereum:
      return t('book-chain-info.ethereum-chain')
    case ETHEREUM_CHAINS.goerli:
      return t('book-chain-info.goerli-chain')
    case ETHEREUM_CHAINS.sepolia:
      return t('book-chain-info.sepolia-chain')
    case POLYGON_CHAINS.mainnet:
      return t('book-chain-info.polygon-chain')
    case POLYGON_CHAINS.mumbai:
      return t('book-chain-info.mumbai-chain')
    case Q_CHAINS.mainet:
      return t('book-chain-info.q-chain')
    case Q_CHAINS.testnet:
      return t('book-chain-info.q-test-chain')
    default:
      return t('book-chain-info.unknown-chain')
  }
}

const sourceChainName = getChainName(
  props.sourceChain.toString() as SupportedChain,
)
const targetChainName = getChainName(
  props.targetChain.toString() as SupportedChain,
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
