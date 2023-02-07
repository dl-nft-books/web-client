<template>
  <div :class="accountClasses">
    <header-network-switcher />
    <drop-down :right="0">
      <template #head="{ menu }">
        <app-button
          :icon-left="$icons.avatarPlaceholder"
          class="account__avatar"
          scheme="flat"
          icon-size="x-medium"
          @click="menu.open"
        />
      </template>
      <template #default="{ menu }">
        <div class="account__body">
          <div class="account__info">
            <icon
              class="account__avatar-icon"
              :name="$icons.avatarPlaceholder"
            />
            <h5 class="account__address account__address--size-x-medium">
              {{ cropAddress(provider.selectedAddress) }}
            </h5>
          </div>
          <app-button
            class="account__action"
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
import { AppButton, Icon, DropDown, HeaderNetworkSwitcher } from '@/common'

type MODIFICATIONS = 'dark-mode' | 'default'

const props = withDefaults(
  defineProps<{
    modification?: MODIFICATIONS
  }>(),
  { modification: 'default' },
)

const accountClasses = computed(() => [
  'account',
  `account--${props.modification}`,
])

const { provider } = useWeb3ProvidersStore()

const copyAddress = async () => {
  if (!provider.selectedAddress) return

  try {
    await copyToClipboard(provider.selectedAddress)
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.account {
  display: flex;
  align-items: center;
  position: relative;
  gap: toRem(20);
}

.account__body {
  background-color: var(--background-primary);

  .account--dark-mode & {
    background-color: var(--background-quaternary);
  }
}

.account__info {
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
    background-color: var(--background-tertiary);
    bottom: 0;
  }
}

.account__address {
  @include p-body-2;

  color: var(--text-secondary-main);
  user-select: none;

  .account--dark-mode & {
    @include text-color-invert;
  }
}

.account__avatar {
  background-color: var(--background-primary);
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
    background-color: var(--background-tertiary);
  }

  .account--dark-mode & {
    background-color: transparent;
    border: toRem(1) solid var(--white);
  }
}

.account__avatar-icon {
  --size: #{toRem(28)};

  max-width: var(--size);
  max-height: var(--size);
}

.account__action {
  --app-button-bg-hover: rgba(var(--drop-down-shadow-rgb), 0.2);

  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: toRem(10) toRem(30);
  gap: toRem(15);
  width: 100%;
  min-height: toRem(50);
  user-select: none;

  .account--dark-mode & {
    --app-button-text-hover: var(--text-primary-invert-main);

    @include text-color-invert;
  }
}

.account__action-icon {
  --size: #{toRem(24)};

  max-width: var(--size);
  max-height: var(--size);
}
</style>
