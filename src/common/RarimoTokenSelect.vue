<template>
  <div class="rarimo-token-select">
    <button
      v-for="item in valueOptions"
      :key="item.address"
      class="rarimo-token-select__option"
      :class="{
        'rarimo-token-select__option--picked':
          item.address === modelValue?.address,
      }"
      @click="emit('update:modelValue', item)"
    >
      <section class="rarimo-token-select__option-wrapper">
        <img
          class="rarimo-token-select__logo"
          :src="item.logoURI"
          :alt="item.name"
        />
        <div class="rarimo-token-select__option-info">
          <p class="rarimo-token-select__token-name">
            {{ item.name }}
          </p>
          <p class="rarimo-token-select__token-symbol">
            {{ item.symbol }}
          </p>
        </div>
      </section>

      <span class="rarimo-token-select__balance">{{ item.balance }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PaymentToken } from '@rarimo/nft-checkout'

withDefaults(
  defineProps<{
    valueOptions: PaymentToken[]
    modelValue?: PaymentToken
  }>(),
  {
    modelValue: undefined,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: PaymentToken | undefined): void
}>()
</script>

<style lang="scss" scoped>
.rarimo-token-select {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.rarimo-token-select__option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: toRem(4);
  gap: toRem(8);
  padding: toRem(8);
  transition: background-color 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: var(--border-primary-main);
  }

  &--picked {
    background-color: var(--border-primary-main);
  }
}

.rarimo-token-select__option-wrapper {
  display: flex;
  align-items: center;
  gap: toRem(12);
}

.rarimo-token-select__option-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;
}

.rarimo-token-select__logo {
  --size: #{toRem(40)};

  max-width: var(--size);
  max-height: var(--size);
  border-radius: 100%;
}

.rarimo-token-select__token-name {
  font-size: toRem(14);
  font-weight: 700;
  line-height: 130%;
}

.rarimo-token-select__token-symbol {
  font-size: toRem(14);
  line-height: 130%;
  color: var(--text-primary-dark);
}

.rarimo-token-select__balance {
  font-weight: 400;
  font-size: toRem(14);
  line-height: 130%;
}
</style>
