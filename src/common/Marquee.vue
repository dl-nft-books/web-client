<template>
  <div class="marquee">
    <ul class="marquee__wrapper">
      <template v-for="(item, index) in text" :key="index">
        <li class="marquee__text">
          {{ item }}
        </li>
        <div class="marquee__delimiter" />
      </template>
    </ul>

    <!-- For infinite scrolling we need to dublicate text -->
    <ul class="marquee__wrapper" aria-hidden="true">
      <template v-for="(item, index) in text" :key="index">
        <li class="marquee__text">
          {{ item }}
        </li>
        <div class="marquee__delimiter" />
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string[]
}>()
</script>

<style scoped lang="scss">
.marquee {
  --marquee-text-color: #a9a9a9;
  --marquee-border-color: #efefef;
  --marquee-background: #d7dadb;
  --gap: #{toRem(15)};

  border-top: toRem(1) solid var(--marquee-border-color);
  border-bottom: toRem(1) solid var(--marquee-border-color);
  overflow: hidden;
  height: toRem(35);
  display: flex;
  user-select: none;
}

.marquee__wrapper {
  animation: marquee-animation 10s linear infinite;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  justify-content: space-around;
  align-items: center;
  gap: var(--gap);
  margin-right: var(--gap);
  min-width: 100%;
}

.marquee__delimiter {
  width: toRem(6);
  height: toRem(6);
  background-color: var(--marquee-background);
}

.marquee__text {
  color: var(--marquee-text-color);
  font-style: italic;
}

@keyframes marquee-animation {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
}
</style>
