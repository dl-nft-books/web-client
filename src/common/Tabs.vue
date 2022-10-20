<script lang="ts" setup>
interface TabsType {
  translation: string
  id: string
}

enum EVENTS {
  updateCurrentTabId = 'update:current-tab-id',
}

defineProps<{
  currentTabId: string
  tabs: TabsType[]
}>()

const emit = defineEmits<{
  (event: EVENTS.updateCurrentTabId, value: string): void
}>()

function onClick(id: string) {
  emit(EVENTS.updateCurrentTabId, id)
}
</script>

<template>
  <div class="tabs">
    <button
      v-for="(item, id) in tabs"
      :key="id"
      class="tabs__button"
      :class="{ 'tabs__button--active': currentTabId === item.id }"
      type="button"
      @click="onClick(item.id)"
    >
      {{ item.translation }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
  gap: toRem(14);
  padding-bottom: toRem(2);
  border-bottom: toRem(1) solid var(--border-secondary);
}

.tabs__button {
  position: relative;
  font-size: toRem(24);
  font-family: var(--app-font-family);
  font-weight: 400;
  padding-right: toRem(10);
  color: var(--text-secondary-main);
  transition: all 0.2s linear;

  &--active {
    color: var(--text-primary-main);
    font-weight: 500;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -toRem(3);
      width: 100%;
      height: toRem(2);
      background: var(--primary-main);
      transition: all 0.2s ease;
    }
  }
}
</style>
