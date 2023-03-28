<template>
  <div class="line-chart">
    <p class="line-chart__title">
      {{ title }}
    </p>
    <select-field
      v-model="currentFilter"
      class="line-chart__filter"
      modifications="dark border-rounded transparent-head"
      :value-options="salesFiltersValues"
    />
    <line-chart class="line-chart__diagram" :chart-data="chartData" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { LineChart } from '@/common'
import { SelectField } from '@/fields'

import { useI18n } from 'vue-i18n'

export type SalesPeriod = 'week' | 'month' | 'year'

const props = withDefaults(
  defineProps<{
    modelValue?: SalesPeriod
    title: string
    chartData: {
      categories: Array<string>
      data: Array<number>
      name: string
    }
  }>(),
  {
    modelValue: 'week',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: SalesPeriod): void
}>()

const { t } = useI18n()

const salesFiltersValues = [
  {
    value: 'week',
    label: t('statistics-page.sales-week-lbl'),
  },
  {
    value: 'month',
    label: t('statistics-page.sales-month-lbl'),
  },
  {
    value: 'year',
    label: t('statistics-page.sales-year-lbl'),
  },
]

const currentFilter = ref<SalesPeriod>(props.modelValue)

watch(currentFilter, () => {
  emit('update:modelValue', currentFilter.value)
})
</script>

<style lang="scss" scoped>
.line-chart {
  display: flex;
  flex-direction: column;
  background-color: var(--background-secondary);
  border-radius: toRem(12);
  border: toRem(1) solid var(--border-black);
  padding: toRem(20) toRem(24);
  min-width: toRem(600);
}

.line-chart__title {
  @include chart-title;
}

.line-chart__diagram {
  border: none;
}

.line-chart__filter {
  max-width: toRem(200);
  margin: 0 auto;
}
</style>
