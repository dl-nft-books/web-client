<template>
  <div class="donut-chart">
    <div class="donut-chart__title">
      <slot />
    </div>
    <div id="donut-chart__instance" ref="chartInstanceElement"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import Highcharts from 'highcharts'

const props = defineProps<{
  data: {
    name: string
    y: number
    color: string
  }[]
}>()

const chartInstanceElement = ref<HTMLElement | undefined>()

const init = () => {
  if (!chartInstanceElement.value) return

  Highcharts.chart(
    chartInstanceElement.value,
    {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Gilroy',
        },
        height: chartInstanceElement.value?.offsetWidth,
        width: chartInstanceElement.value.offsetWidth,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
        style: {
          color: 'var(--text-primary-invert-main)',
          fontSize: '24px',
          fontWeight: '500',
        },
      },
      tooltip: {
        valueSuffix: '%',
        formatter: function () {
          return `${this.point.name}: ${this.y}`
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          innerSize: '85%',
          borderWidth: 0,
          shadow: false,
          center: ['50%', '50%'],
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
        },
        series: {
          animation: {
            duration: 750,
            easing: 'easeOutQuad',
          },
        },
      },
      series: [
        {
          animation: {
            duration: 750,
            easing: 'easeOutQuad',
          },
          data: props.data,
          size: chartInstanceElement.value?.offsetWidth / 1.25,
          startAngle: 0,
          type: 'pie',
        },
      ],
    },
    () => ({}),
  )
}

onMounted(() => init())

watch(
  () => props.data,
  () => init(),
  { deep: true },
)
</script>

<style lang="scss" scoped>
.donut-chart {
  position: relative;
}

.donut-chart__title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
