<template>
  <div class="bar-chart">
    <div class="bar-chart__instance" ref="barChartElement" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Highcharts, { SeriesOptionsType } from 'highcharts'

export type SeriesOpts = {
  y: number
  subValue: number
  color: string
}

const props = defineProps<{
  chartOptions?: {
    height?: string
  }
  chartData: {
    name: string
    categories: Array<string>
    series: Array<SeriesOpts>
  }
}>()

const barChartElement = ref<HTMLElement | undefined>()

onMounted(() => {
  if (!barChartElement.value) return

  Highcharts.chart(
    barChartElement.value,
    {
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      chart: {
        type: 'bar',
        polar: false,
        backgroundColor: '#232323',
        margin: 0,
        plotBackgroundColor: '#232323',
        height: props.chartOptions?.height ?? '100%',
      },
      plotOptions: {
        area: {
          fillColor: '#232323',
        },
        series: {
          animation: {
            duration: 750,
            easing: 'easeOutQuad',
          },
        },
        bar: {
          borderRadius: 5,
          pointWidth: 10,
          borderWidth: 0,
          cursor: 'pointer',
          groupPadding: 0,
          grouping: false,
          dataLabels: {
            enabled: true,
            formatter: function () {
              const percentage = Highcharts.numberFormat(this.y, 2)
              const currencyValue = Highcharts.numberFormat(
                this.point.subValue,
                2,
              )
              const currencySymbol = this.point.category

              return `${currencySymbol} - ${percentage}% (${currencyValue} USD)`
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        categories: props.chartData.categories,
        visible: false,
        title: {
          text: null,
        },
      },
      yAxis: {
        visible: false,
        title: {
          text: '',
        },
      },
      series: [
        // empty series for background of each bar
        {
          name: '100%',
          data: new Array(props.chartData.series.length)
            .fill('')
            .map(() => 100),
          color: 'rgba(255, 255, 255, 0.2)',
          zIndex: -1,
          opacity: 0.5,
          enableMouseTracking: false,
          dataLabels: {
            enabled: false,
          },
        } as SeriesOptionsType,
        {
          name: props.chartData.name,
          data: props.chartData.series,
        } as SeriesOptionsType,
      ],
    },
    () => ({}),
  )
})
</script>
