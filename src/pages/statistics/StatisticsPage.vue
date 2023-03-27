<template>
  <div class="statistics-page">
    <donut-chart
      :colors="donutColors"
      :data="donutChartValues"
      :title="$t('statistics-page.chains-popularity-lbl')"
      :summary-label="$t('statistics-page.total-chains-lbl')"
      :summary-value="'3'"
      :inner-icon="$icons.booksPile"
    />
    <bar-chart
      :title="$t('statistics-page.token-distribution-lbl')"
      :total-label="$t('statistics-page.token-total-lbl')"
      :total-value="barChartTotal"
      :bar-chart-data="barChartData"
    />
  </div>
</template>
<script setup lang="ts">
import { DonutChart, BarChart } from '@/pages/statistics'

/* All values in that component hard-coded for now */

const donutChartValues: { name: string; value: number }[] = [
  {
    name: 'Ethereum',
    value: 90,
  },
  {
    name: 'Polygon',
    value: 40,
  },
  {
    name: 'Q',
    value: 20,
  },
]

const donutColors = ['#4CBECF', '#FF1768', '#FFD36E']

const barChartTotal = 1561.23

const barChartData = {
  categories: ['MATIC', 'ETH', 'Q', 'Other tokens'],
  name: 'Token distribution',
  series: [
    {
      y: 50, // percentage
      subValue: barChartTotal * 0.5, // value in USD or other currency idk
      color: '#4CBECF',
    },

    {
      y: 25,
      subValue: barChartTotal * 0.25,
      color: '#39C337',
    },

    {
      y: 15,
      subValue: barChartTotal * 0.15,
      color: '#FFC94E',
    },
    {
      y: 10,
      subValue: barChartTotal * 0.1,
      color: '#FF8634',
    },
  ],
}
</script>

<style scoped lang="scss">
.statistics-page {
  flex: 1;
  display: flex;
  flex-flow: row wrap;
  gap: toRem(30);
  padding: toRem(40);
  background-color: var(--black);
}
</style>
