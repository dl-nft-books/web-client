<template>
  <div class="bar-chart">
    <p class="bar-chart__title">
      {{ title }}
    </p>
    <div class="bar-chart__summary">
      <p class="bar-chart__total-lbl">
        {{ totalLabel }}
      </p>
      <span class="bar-chart__total-value">{{
        $t('statistics-page.token-total-value', { amount: totalValue })
      }}</span>
    </div>

    <horizontal-bar-chart
      class="bar-chart__diagram"
      :chart-data="barChartData"
      :chart-options="barChartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { HorizontalBarChart } from '@/common'

const props = defineProps<{
  title: string
  totalLabel: string
  totalValue: number
  barChartData: {
    categories: string[]
    name: string
    series: {
      y: number
      subValue: number
      color: string
    }[]
  }
}>()

const barChartOptions = {
  height: `${(props.barChartData.series.length - 1) * 65}px`,
}
</script>

<style scoped lang="scss">
.bar-chart {
  display: flex;
  flex-direction: column;
  background-color: var(--background-secondary);
  height: min-content;
  border-radius: toRem(12);
  border: toRem(1) solid var(--border-black);
  padding: toRem(20) toRem(24);
  width: toRem(600);
}

.bar-chart__summary {
  display: flex;
  gap: toRem(5);
  margin-top: toRem(20);
}

.bar-chart__total-lbl {
  font-size: toRem(18);
  line-height: 160%;
  color: var(--text-primary-invert-main);
}

.bar-chart__total-value {
  font-size: toRem(18);
  line-height: 160%;
  color: var(--text-primary-invert-main);
  font-weight: 600;
}

.bar-chart__diagram {
  border: none;
  max-width: 100%;
  padding: toRem(10) 0;
}

.bar-chart__title {
  @include chart-title;
}
</style>
