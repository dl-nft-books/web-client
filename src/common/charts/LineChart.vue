<template>
  <div class="line-chart">
    <div class="line-chart__instance" ref="lineChartRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import Highcharts from 'highcharts'

const lineChartRef = ref<HTMLElement | undefined>()

type LineChartData = {
  categories: Array<string>
  data: Array<number>
  name: string
}

const props = defineProps<{
  chartData: LineChartData
}>()

// cant use ref - it causes visual bugs
let chart: Highcharts.Chart | null = null

const lineChartOptions = computed(() => ({
  chart: {
    type: 'areaspline',
    backgroundColor: '#232323',
    height: '300px',
  },
  plotOptions: {
    areaspline: {
      color: '#4CBECF',
    },
    series: {
      pointPlacement: 'on',
      animation: {
        duration: 750,
        easing: 'easeOutQuad',
      },
    },
  },
  title: {
    text: '',
  },
  legend: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    categories: props.chartData.categories,
    lineColor: '#3E3E3E',
    labels: {
      style: {
        color: '#FFFFFF',
        fontSize: '14px',
      },
    },
    plotLines: props.chartData.data.map((_, idx) => ({
      value: idx,
      width: 1,
      color: '#3E3E3E',
      dashStyle: 'Dash',
    })),
  },
  yAxis: {
    title: {
      text: '',
    },
    labels: {
      style: {
        color: '#FFFFFF',
        fontSize: '14px',
      },
    },
    gridLineDashStyle: 'Dash',
    gridLineColor: '#3E3E3E',
  },
  series: [
    {
      name: props.chartData.name,
      data: props.chartData.data,
      fillColor: 'rgba(159, 225, 235, 0.1)',
    },
  ],
}))

const init = () => {
  if (!lineChartRef.value) return

  chart = Highcharts.chart(
    lineChartRef.value,
    lineChartOptions.value as Highcharts.Options,
  )
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (!chart) return

  chart.destroy()
})

watch(
  () => props.chartData,
  () => {
    if (!chart) return

    chart.update({
      series: lineChartOptions.value.series,
      xAxis: lineChartOptions.value.xAxis,
    } as Highcharts.Options)
  },
  { deep: true },
)
</script>
