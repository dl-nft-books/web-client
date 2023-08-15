<template>
  <div class="generation-view">
    <div class="generation-view__wrapper">
      <animation
        :animation-data="(loaderAnimation as unknown as JSON)"
        :loop="true"
        :speed="1"
      />
    </div>
    <h5 class="generation-view__submitting-title">
      {{ $t('generation-view.submitting-title') }}
    </h5>
    <p class="generation-view__submitting-message">
      {{ $t('generation-view.submitting-message') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import loaderAnimation from '@/assets/animations/loader.json'

import { Animation } from '@/common'
</script>

<style lang="scss" scoped>
.generation-view__wrapper {
  margin: 0 auto toRem(30);
  max-width: toRem(300);
}

.generation-view__submitting-title {
  text-align: center;
}

.generation-view__submitting-message {
  max-width: toRem(310);
  text-align: center;
  font-size: toRem(18);
  line-height: 160%;
}
</style>
