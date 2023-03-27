<template>
  <canvas class="doughnut-chart" ref="canvasRef" />
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'

import { Plugin } from 'chart.js'
import { ref, onMounted } from 'vue'
import { ICON_NAMES } from '@/enums'

const props = withDefaults(
  defineProps<{
    icon?: ICON_NAMES
    labels: Array<string>
    chartSubjectLabel: string
    data: Array<number>
    radius?: number
    cutout?: number
  }>(),
  {
    icon: ICON_NAMES.booksPile,
    radius: 96,
    cutout: 120,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)

const image = new Image()
image.src = `/src/assets/icons/${props.icon}-icon.svg`

const customCanvasBackgroundImagePlugin: Plugin = {
  id: 'customCanvasBackgroundImage',
  beforeDraw: chart => {
    if (image.complete) {
      const ctx = chart.ctx
      const { top, left, width, height } = chart.chartArea
      const x = left + width / 2 - image.width / 2
      const y = top + height / 2 - image.height / 2
      ctx.drawImage(image, x, y)
    } else {
      image.onload = () => chart.draw()
    }
  },
}

// const customCanvasBackgroundColorPlugin = {
//   id: 'customCanvasBackgroundColor',
//   beforeDraw: (chart, args, options) => {
//     const { ctx } = chart
//     ctx.save()
//     ctx.globalCompositeOperation = 'destination-over'
//     ctx.fillStyle = options.color || '#99ffff'
//     ctx.fillRect(0, 0, chart.width, chart.height)
//     ctx.restore()
//   },
// }

onMounted(() => {
  if (!canvasRef.value) return

  new Chart(canvasRef.value, {
    type: 'doughnut',
    plugins: [customCanvasBackgroundImagePlugin],
    data: {
      labels: ['Ethereum', 'Polygon', 'Q'],
      datasets: [
        {
          label: 'MOney Spent',
          data: [300, 50, 100],
          hoverOffset: 4,
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        // customCanvasBackgroundColor: {
        //   color: '#232323',
        // },
      },
      cutout: 120,
      radius: 96,
    },
  })
})
</script>

<style scoped lang="scss">
.doughnut-chart {
  border-radius: toRem(12);
  background-color: var(--background-secondary);
  border: toRem(1) solid var(--border-black);
}
</style>
