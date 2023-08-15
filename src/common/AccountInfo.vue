<template>
  <div :class="accountClasses">
    <network-switcher :modification="modification" />
    <drop-down :right="0">
      <template #head="{ menu }">
        <app-button
          :icon-left="$icons.avatarPlaceholder"
          class="account-info__avatar"
          scheme="flat"
          icon-size="x-medium"
          @click="menu.open"
        />
      </template>
      <template #default="{ menu }">
        <div class="account-info__body">
          <div class="account-info__info">
            <icon
              class="account-info__avatar-icon"
              :name="$icons.avatarPlaceholder"
            />
            <h5 v-if="provider.address" class="account-info__address">
              {{ cropAddress(provider.address) }}
            </h5>
          </div>
          <app-button
            class="account-info__action"
            scheme="default"
            modification="default"
            :icon-left="$icons.copy"
            :text="$t('app-navbar.copy-address')"
            @click="copyAddress(), menu.close()"
          />
        </div>
      </template>
    </drop-down>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cropAddress, copyToClipboard, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { AppButton, Icon, DropDown, NetworkSwitcher } from '@/common'

type MODIFICATIONS = 'dark-mode' | 'default'

const props = withDefaults(
  defineProps<{
    modification?: MODIFICATIONS
  }>(),
  { modification: 'default' },
)

const accountClasses = computed(() => [
  'account-info',
  `account-info--${props.modification}`,
])

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const copyAddress = async () => {
  if (!provider.value.address) return

  try {
    await copyToClipboard(provider.value.address)
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.account-info {
  display: flex;
  align-items: center;
  position: relative;
  gap: toRem(20);
}

.account-info__body {
  background-color: var(--background-primary-main);

  .account-info--dark-mode & {
    background-color: var(--background-secondary);
  }
}

.account-info__info {
  display: flex;
  align-items: center;
  padding: toRem(15) toRem(20);
  position: relative;
  gap: toRem(10);

  &:after {
    content: '';
    position: absolute;
    height: toRem(1);
    left: toRem(15);
    width: 85%;
    background-color: var(--border-primary-light);
    bottom: 0;
  }
}

.account-info__address {
  font-size: toRem(16);
  color: var(--text-secondary-main);
  user-select: none;

  .account-info--dark-mode & {
    color: var(--text-primary-light);
  }
}

.account-info__avatar {
  background-color: var(--background-primary-main);
  display: flex;
  align-items: center;
  padding: toRem(12) toRem(16);
  border-radius: toRem(8);
  border: toRem(1) solid var(--text-secondary-main);
  height: toRem(52);
  width: toRem(60);
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &:hover {
    cursor: pointer;
    background-color: var(--border-primary-light);
  }

  .account-info--dark-mode & {
    background-color: transparent;
    border: toRem(1) solid var(--border-primary-light);
  }
}

.account-info__avatar-icon {
  --size: #{toRem(28)};

  max-width: var(--size);
  max-height: var(--size);
}

.account-info__action {
  --app-button-bg-hover: rgba(var(--drop-down-shadow-rgb), 0.2);

  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: toRem(10) toRem(30);
  gap: toRem(15);
  width: 100%;
  min-height: toRem(50);
  user-select: none;

  .account-info--dark-mode & {
    --app-button-text-hover: var(--text-primary-light);

    color: var(--text-primary-light);
  }
}

.account-info__action-icon {
  --size: #{toRem(24)};

  max-width: var(--size);
  max-height: var(--size);
}
</style>
