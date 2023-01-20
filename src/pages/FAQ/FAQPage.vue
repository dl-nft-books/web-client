<template>
  <div class="faq-page">
    <head class="faq-page__head">
      <h1 class="faq-page__title">
        {{ $t('faq-page.title') }}
      </h1>
    </head>
    <section class="faq-page__overview">
      <div>
        <h3 class="faq-page__overview-title">
          {{ $t('faq-page.overview-title') }}
        </h3>
        <section class="faq-page__overview-info">
          <p class="faq-page__overview-point">
            {{ $t('faq-page.overview-abstract-1') }}
          </p>
          <p class="faq-page__overview-point">
            {{ $t('faq-page.overview-abstract-2') }}
          </p>
          <p class="faq-page__overview-point">
            {{ $t('faq-page.overview-abstract-3') }}
          </p>
          <p class="faq-page__overview-point">
            {{ $t('faq-page.overview-disclaimer') }}
          </p>
        </section>
      </div>
      <img
        class="faq-page__overview-image"
        src="/images/fancy-image.png"
        alt="fancy-image"
      />
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.faq-page {
  max-width: 100%;
  padding: 0;
  background-color: var(--background-quinary);
}

.faq-page__title {
  margin-bottom: toRem(40);
  font-weight: 700;
  font-size: toRem(40);
  color: var(--background-primary);
  max-width: toRem(600);
  line-height: toRem(50);

  &:after {
    display: block;
    content: '';
    height: toRem(2);
    margin-top: toRem(10);
    background: var(--primary-main);
    margin-left: auto;
    margin-right: auto;
    width: clamp(#{toRem(155)}, 35%, #{toRem(215)});
  }

  @include respond-to(medium) {
    font-size: toRem(40);
  }
}

/* stylelint-disable */
.faq-page__head {
  width: 100%;
  min-height: toRem(300);
  display: flex;
  justify-content: center;
  text-align: center;
  padding: toRem(115) var(--app-padding-right) toRem(100)
    var(--app-padding-left);
  background-image: linear-gradient(
      360deg,
      var(--background-quinary) 0.12%,
      rgba(var(--background-quinary-rgb), 0.9) 55.52%,
      rgba(var(--background-quinary-rgb), 0.5) 100%
    ),
    url('/images/faq-background.png');
  background-size: contain;
}
/* stylelint-enable */

.faq-page__overview {
  display: flex;
  justify-content: space-between;
  gap: toRem(90);
  padding: toRem(10) toRem(100);
}

.faq-page__overview-title {
  font-weight: 700;
  font-size: toRem(24);
  line-height: toRem(30);
  color: var(--primary-main);
  margin-bottom: toRem(20);
  margin-top: toRem(60);
}

.faq-page__overview-info {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
}

.faq-page__overview-point {
  font-weight: 400;
  line-height: 120%;
  color: var(--text-primary-invert-main);
}
</style>
