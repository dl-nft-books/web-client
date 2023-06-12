<template>
  <div class="bookshelf-rarimo-message">
    <p class="bookshelf-rarimo-message__title">
      {{ $t('bookshelf-rarimo-message.title-part-1') }}
      <span class="bookshelf-rarimo-message__chain">{{ targetChainName }}</span>

      {{ $t('bookshelf-rarimo-message.title-part-2') }}
      <span class="bookshelf-rarimo-message__chain">{{ sourceChainName }}</span>
    </p>
    <p>
      {{ $t('bookshelf-rarimo-message.subtitle') }}
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
      return t('bookshelf-rarimo-message.ethereum-chain')
    case ETHEREUM_CHAINS.goerli:
      return t('bookshelf-rarimo-message.goerli-chain')
    case ETHEREUM_CHAINS.sepolia:
      return t('bookshelf-rarimo-message.sepolia-chain')
    case POLYGON_CHAINS.mainnet:
      return t('bookshelf-rarimo-message.polygon-chain')
    case POLYGON_CHAINS.mumbai:
      return t('bookshelf-rarimo-message.mumbai-chain')
    case Q_CHAINS.mainet:
      return t('bookshelf-rarimo-message.q-chain')
    case Q_CHAINS.testnet:
      return t('bookshelf-rarimo-message.q-test-chain')
    default:
      return t('bookshelf-rarimo-message.unknown-chain')
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
.bookshelf-rarimo-message__title {
  line-height: toRem(20);
}

.bookshelf-rarimo-message__chain {
  color: var(--primary-main);
}
</style>
