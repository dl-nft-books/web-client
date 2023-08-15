<template>
  <div class="nft-description">
    <p class="nft-description__description">
      {{ description || $t('nft-description.default-desc') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ description?: string }>()
</script>

<style lang="scss" scoped>
.nft-description__description {
  font-size: toRem(18);
  line-height: toRem(23);
  white-space: pre-wrap;
  word-wrap: break-word;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}
</style>
