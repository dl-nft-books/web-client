<template>
  <div class="donut-chart">
    <p class="donut-chart__title">
      {{ title }}
    </p>
    <donut-chart class="donut-chart__diagram" :data="donutChartData">
      <div v-if="innerIcon" class="donut-chart__diagram-inner">
        <img :src="`/src/assets/icons/${innerIcon}-icon.svg`" />
      </div>
    </donut-chart>
    <section class="donut-chart__summary-wrapper">
      <div class="donut-chart__summary">
        <span>{{ summaryLabel }}</span>
        <span class="donut-chart__summary-value">{{ summaryValue }}</span>
      </div>

      <span class="donut-chart__more-details">{{
        $t('statistics-page.more-lbl')
      }}</span>
    </section>
  </div>
</template>

<script setup lang="ts">
import { DonutChart } from '@/common'
import { ICON_NAMES } from '@/enums'
import { computed } from 'vue'

type ChartData = {
  name: string
  value: number
}

const props = defineProps<{
  colors: Array<string>
  data: Array<ChartData>
  innerIcon?: ICON_NAMES
  title: string
  summaryLabel: string
  summaryValue: string
}>()

const donutChartData = computed(() =>
  props.data.map((item, ind) => {
    return {
      name: item.name,
      y: item.value,
      color: props.colors[ind % props.colors.length],
    }
  }),
)
</script>

<style scoped lang="scss">
.donut-chart {
  width: toRem(396);
  background-color: var(--background-secondary);
  border-radius: toRem(12);
  padding: toRem(20) toRem(10);
  border: toRem(1) solid var(--border-black);
  height: min-content;
}

.donut-chart__title {
  @include chart-title;
}

.donut-chart__diagram {
  --chart-size: #{toRem(240)};

  max-width: var(--chart-size);
  max-height: var(--chart-size);
  border: none;
  margin: 0 auto;
}

.donut-chart__diagram-inner {
  margin-top: toRem(15);
}

.donut-chart__summary-wrapper {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(14);
}

.donut-chart__summary {
  display: flex;
  align-items: center;
  gap: toRem(16);
  color: var(--text-primary-invert-main);
}

.donut-chart__summary-value {
  font-size: toRem(16);
  font-weight: 700;
  color: var(--text-primary-invert-main);
}

.donut-chart__more-details {
  color: var(--primary-main);
  font-size: toRem(18);
  line-height: 160%;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
}
</style>
