<template>
  <div :class="cardWrapperClasses">
    <div :class="cardClasses">
      <div class="about-us-quote-card__image-wrapper">
        <img class="about-us-quote-card__image" :src="image" />
        <h4 class="about-us-quote-card__title">
          {{ title }}
        </h4>
        <p
          :class="[
            'about-us-quote-card__subtitle',
            'about-us-quote-card__subtitle--size-small',
          ]"
        >
          {{ subtitle }}
        </p>
      </div>

      <div class="about-us-quote-card__content">
        <icon
          class="about-us-quote-card__content-icon"
          :name="$icons.leftQuote"
        />
        <p
          v-for="(quote, index) in quotesList"
          :key="index"
          :class="[
            'about-us-quote-card__content-item',
            'about-us-quote-card__content-item--size-medium',
          ]"
        >
          {{ quote }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/common'

type SCHEMES = 'dark' | 'default'
type MODIFICATIONS = 'reverse' | 'default'

const props = withDefaults(
  defineProps<{
    quotesList: string[]
    image: string
    title: string
    subtitle?: string
    scheme?: SCHEMES
    modification?: MODIFICATIONS
  }>(),
  {
    scheme: 'default',
    modification: 'default',
    subtitle: '',
  },
)

const cardWrapperClasses = computed(() => [
  'about-us-quote-card__wrapper',
  `about-us-quote-card__wrapper--${props.scheme}`,
])

const cardClasses = computed(() => [
  'about-us-quote-card',
  `about-us-quote-card--${props.modification}`,
])
</script>

<style scoped lang="scss">
.about-us-quote-card__wrapper {
  background-color: var(--background-primary);
  padding-top: toRem(90);
  padding-bottom: toRem(50);

  &--dark {
    background: none;
  }
}

.about-us-quote-card {
  background-color: var(--background-tertiary);
  border-radius: toRem(11);
  display: flex;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  position: relative;

  @include respond-to(medium) {
    width: 80%;
    flex-direction: column;
  }

  &--reverse {
    flex-direction: row-reverse;

    @include respond-to(medium) {
      flex-direction: column;
    }
  }

  .about-us-quote-card__wrapper--dark & {
    background-color: var(--background-secondary);
  }
}

.about-us-quote-card__image-wrapper {
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  width: max-content;
  transform: translate(toRem(-65), toRem(-40));

  @include respond-to(medium) {
    transform: translate(0, toRem(-40));
    margin-left: auto;
    margin-right: auto;
  }

  .about-us-quote-card--reverse & {
    transform: translate(toRem(60), toRem(-60));

    @include respond-to(medium) {
      transform: translate(0, toRem(-40));
    }
  }
}

.about-us-quote-card__image {
  max-width: toRem(280);
  align-self: flex-end;

  @include respond-to(medium) {
    align-self: center;
    max-width: toRem(200);
  }
}

.about-us-quote-card__title {
  text-transform: uppercase;
  margin-top: toRem(25);
  align-self: flex-end;

  @include respond-to(medium) {
    align-self: center;
  }

  .about-us-quote-card__wrapper--dark & {
    align-self: flex-start;

    @include text-color-invert;

    @include respond-to(medium) {
      align-self: center;
    }
  }
}

.about-us-quote-card__subtitle {
  @include p-body-2;

  text-transform: uppercase;
  margin-top: toRem(10);
  align-self: flex-end;

  @include respond-to(medium) {
    align-self: center;
  }

  .about-us-quote-card__wrapper--dark & {
    align-self: flex-start;

    @include text-color-invert;

    @include respond-to(medium) {
      align-self: center;
    }
  }
}

.about-us-quote-card__content {
  @include flex-container;

  justify-content: center;
  padding: toRem(40) toRem(30);
  gap: toRem(10);

  @include respond-to(medium) {
    padding: 0 toRem(30) toRem(30) toRem(30);
  }

  .about-us-quote-card--reverse & {
    align-items: flex-end;
  }
}

.about-us-quote-card__content-icon {
  --size: #{toRem(57)};

  max-width: var(--size);
  max-height: var(--size);
  position: absolute;
  top: toRem(-30);

  @include respond-to(medium) {
    --size: #{toRem(32)};

    right: toRem(-10);
    top: 60%;
  }
}

.about-us-quote-card__content-item {
  @include p-body-2;

  align-self: flex-start;

  @include respond-to(medium) {
    padding: 2vw;
    font-size: toRem(16);
  }

  .about-us-quote-card__wrapper--dark & {
    padding-top: toRem(15);

    @include text-color-invert;
  }
}
</style>
