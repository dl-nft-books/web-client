<template>
  <div class="technical-work">
    <img
      class="technical-work__image"
      src="/images/technical-work.png"
      :alt="$t('technical-work-page.alt-technical-work')"
    />
    <section class="technical-work__info">
      <h3 class="technical-work__title">
        {{ $t('technical-work-page.title') }}
      </h3>
      <h4 class="technical-work__subtitle">
        {{ $t('technical-work-page.subtitle') }}
      </h4>
    </section>
    <img class="technical-work__background" src="/images/fancy-lines.png" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.technical-work {
  display: flex;
  flex: 1;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: var(--z-index-layer-1);
  gap: toRem(100);
  background-color: var(--background-primary-dark);

  @include respond-to(tablet) {
    flex-direction: column;
    gap: toRem(30);
    align-items: center;
    text-align: center;
  }
}

.technical-work__background {
  @include background-image;
}

.technical-work__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: toRem(70);
  max-width: toRem(600);
  gap: toRem(24);
  position: relative;
  z-index: var(--z-index-layer-2);

  @include respond-to(tablet) {
    gap: toRem(12);
  }
}

.technical-work__subtitle {
  font-weight: 700;

  @include respond-to(tablet) {
    font-size: toRem(18);
  }
}

.technical-work__title {
  color: var(--primary-main);
  font-size: toRem(32);

  @include respond-to(tablet) {
    font-size: toRem(20);
  }
}

.technical-work__image {
  object-fit: contain;
  background-size: contain;
  position: relative;
  z-index: var(--z-index-layer-2);
  width: clamp(toRem(200), 75%, toRem(400));
}
</style>
