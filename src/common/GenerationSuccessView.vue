<template>
  <div class="generation-success-view">
    <div class="generation-success-view__head">
      <h4>
        {{ $t('generation-success-view.title') }}
      </h4>
    </div>
    <div class="generation-success-view__body">
      <div class="generation-success-view__animation-wrp">
        <animation
          class="generation-success-view__animation"
          :animation-data="(success as unknown as JSON)"
          :loop="true"
          :speed="0.75"
        />
      </div>
      <p v-if="message" class="generation-success-view__message">
        {{ message }}
      </p>
      <a
        v-if="link"
        class="generation-success-view__link"
        target="_blank"
        :href="link"
      >
        {{ $t('generation-success-view.link') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Animation } from '@/common'

import success from '@/assets/animations/success.json'

withDefaults(
  defineProps<{
    message?: string
    link?: string
  }>(),
  {
    message: '',
    link: '',
  },
)
</script>

<style lang="scss" scoped>
.generation-success-view {
  display: flex;
  flex-direction: column;
  max-width: toRem(452);
  padding: toRem(32);
  background: var(--background-primary-light);
  border-radius: toRem(10);
}

.generation-success-view__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: toRem(36);
}

.generation-success-view__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.generation-success-view__animation-wrp {
  margin-bottom: toRem(30);
  max-width: toRem(140);
  max-height: toRem(140);
}

.generation-success-view__message {
  text-align: center;
  margin-bottom: toRem(36);
  max-width: toRem(310);
  font-size: toRem(18);
  line-height: 160%;
}

.generation-success-view__purchase-btn {
  min-width: toRem(144);
  text-transform: uppercase;
}

.generation-success-view__link {
  margin-bottom: toRem(40);
}
</style>
