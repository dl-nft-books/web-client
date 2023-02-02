<template>
  <div class="technical-work">
    <img
      class="technical-work__image technical-work__image--medium"
      src="/images/technical-work.png"
      :alt="$t('technical-work-page.alt-technical-work')"
    />
    <section class="technical-work__info">
      <h3 class="technical-work__title">
        {{ $t('technical-work-page.title') }}
      </h3>
      <p class="technical-work__subtitle">
        {{ $t('technical-work-page.subtitle') }}
      </p>
    </section>
    <div class="technical-work__background" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.technical-work {
  display: flex;
  justify-content: center;
  gap: toRem(100);
  min-height: vh(69);
  position: relative;

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(30);
    align-items: center;
    text-align: center;
  }
}

.technical-work__background {
  background: url('/images/technical-background.png') no-repeat left bottom /
    contain;
  background-size: 50%;
  width: 100%;
  height: vh(69);
  position: absolute;
  z-index: var(--footer-index);
  left: 0;
  bottom: 0;
}

.technical-work__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: toRem(70);
  max-width: toRem(600);
  gap: toRem(24);
}

.technical-work__subtitle {
  font-weight: 500;
  line-height: toRem(29);
  font-size: toRem(24);
}

.technical-work__title {
  color: var(--primary-main);
  font-weight: 700;
  font-size: toRem(32);
  line-height: toRem(40);
}

.technical-work__image {
  object-fit: contain;
  background-size: contain;
  position: relative;
  z-index: var(--page-index);
  width: clamp(toRem(200), 60%, toRem(400));
}
</style>
