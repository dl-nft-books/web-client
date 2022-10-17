<script setup lang="ts">
import { Icon } from '@/common'
import { Slider } from '@/common'
import PopularBookCard from '@/common/PopularBookCard.vue'
import { ref } from 'vue'
import { Book } from '@/types'
import { ErrorHandler } from '@/helpers'
import { NoDataMessage, ErrorMessage, Loader, AppButton } from '@/common'
import { Animation } from '@/common'
import blockchainAnimation from '@/assets/animations/blockchain-animation.json'

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const books = ref<Book[]>([])
const bookSlides = ref<Array<Book[]>>([])
const pageLimit = ref(3)
const currentSlide = ref(0)

const nextSlide = async () => {
  await loadBooks()
  bookSlides.value = []
  for (let i = 0; i < books.value.length; i += pageLimit.value) {
    bookSlides.value.push(books.value.slice(i, i + pageLimit.value))
  }
  if (
    Math.ceil(bookSlides.value.length / pageLimit.value) > currentSlide.value
  ) {
    currentSlide.value++
  } else {
    currentSlide.value = 0
  }
}

const previousSlide = () => {
  if (currentSlide.value) {
    currentSlide.value--
  }
}

const init = async () => {
  try {
    await loadBooks()
    bookSlides.value?.push(books?.value.slice(0, pageLimit.value))
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const loadBooks = async () => {
  books.value = [
    {
      id: '1',
      title: 'Blockchain and decentralized systems, Volume 1',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      coverUrl: 'https://i.ibb.co/dfjmZPF/mock-most-popular-image.png',
    },
    {
      id: '2',
      title: 'Blockchain and decentralized systems, Volume 1',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      coverUrl: 'https://i.ibb.co/dfjmZPF/mock-most-popular-image.png',
    },
    {
      id: '3',
      title: 'Blockchain and decentralized systems, Volume 1',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      coverUrl: 'https://i.ibb.co/dfjmZPF/mock-most-popular-image.png',
    },
    {
      id: '4',
      title: 'Blockchain and decentralized systems, Volume 1',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      coverUrl: 'https://i.ibb.co/dfjmZPF/mock-most-popular-image.png',
    },
  ]
}
init()
</script>

<template>
  <div class="home-page">
    <div class="home-page__head">
      <div class="home-page__head-wrapper">
        <h2 class="home-page__title">
          {{ $t('home-page.title') }}
        </h2>
        <h3 class="home-page__subtitle">
          {{ $t('home-page.subtitle') }}
          <span class="home-page__subtitle home-page__subtitle--highlighted">
            {{ $t('home-page.subtitle-highlighted') }}
          </span>
        </h3>
        <h4 class="home-page__small-title">
          {{ $t('home-page.small-subtitle') }}
        </h4>
        <hr class="home-page__line" />
        <div class="home-page__book-description-wrapper">
          <icon class="home-page__book-description-icon" :name="$icons.book" />
          <span class="home-page__book-description">
            {{ $t('home-page.book-description') }}
          </span>
        </div>
      </div>
    </div>
    <div class="home-page__most-popular">
      <h5 class="home-page__most-popular-title">
        {{ $t('home-page.most-popular-title') }}
      </h5>
      <hr class="home-page__line home-page__line--most-popular-title" />
      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <error-message :message="$t('home-page.loading-error-msg')" />
        </template>
        <template v-else-if="books.length">
          <slider @next-page="nextSlide" @previous-page="previousSlide">
            <div class="home-page__card-container">
              <popular-book-card
                class="home-page__card"
                v-for="book in bookSlides[currentSlide]"
                :key="book.id"
                :book="book"
              />
            </div>
          </slider>
        </template>
        <template v-else>
          <no-data-message :message="$t('home-page.no-data-msg')" />
        </template>
      </template>
      <template v-else>
        <loader />
      </template>
      <app-button
        scheme="flat-inverse"
        class="home-page__view-all-btn"
        :text="$t('home-page.view-all-link')"
        size="small"
      />
    </div>
    <div class="home-page__about-us">
      <div class="home-page__about-us-animation-wrapper">
        <animation
          class="home-page__about-us-animation"
          :animation-data="blockchainAnimation"
          :loop="true"
          :speed="0.75"
        />
      </div>
      <div class="home-page__about-us-content">
        <h4 class="home-page__about-us-title">
          {{ $t('home-page.about-us-title') }}
        </h4>
        <hr class="home-page__line home-page__line--about-us" />
        <p class="home-page__about-us-text">
          {{ $t('home-page.about-us-text-1') }}
        </p>
        <p class="home-page__about-us-text">
          {{ $t('home-page.about-us-text-2') }}
        </p>
      </div>
    </div>
    <div class="home-page__founder">
      <div class="home-page__founder-content-wrapper">
        <div class="home-page__founder-content">
          <h4 class="home-page__founder-content-title">
            {{ $t('home-page.founder-title') }}
          </h4>
          <h5 class="home-page__founder-content-subtitle">
            {{ $t('home-page.founder-subtitle') }}
          </h5>
          <hr class="home-page__line home-page__line--founder" />
          <p class="home-page__founder-content-description">
            {{ $t('home-page.founder-description') }}
          </p>
        </div>
        <div class="home-page__founder-image-wrapper">
          <img
            class="home-page__founder-image"
            src="/static/images/pavlo-kravchenko.png"
            :alt="$t('home-page.founder-image')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding: toRem(100) 0 0;
}

.home-page__head-wrapper {
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
}

.home-page__title {
  margin-bottom: toRem(70);
  font-weight: 1000;
  font-size: toRem(58);
  letter-spacing: toRem(3);
  text-transform: uppercase;
  color: var(--app-background-primary);
  text-shadow: toRem(-1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(1) 0 var(--text-primary-main),
    toRem(1) toRem(-1) 0 var(--text-primary-main),
    toRem(-1) toRem(-1) 0 var(--text-primary-main);
}

.home-page__subtitle {
  font-weight: 1000;
  font-size: toRem(48);
  margin-bottom: toRem(15);

  &--highlighted {
    color: var(--primary-main);
  }
}

.home-page__small-title {
  font-size: toRem(28);
  font-weight: 400;
  white-space: pre-line;
  line-height: 120%;
  margin-bottom: toRem(10);
}

.home-page__line {
  height: toRem(2);
  border: none;
  background: var(--primary-main);
  margin: 0;
  width: toRem(215);

  &--most-popular-title {
    margin: toRem(10) auto 0;
  }

  &--about-us {
    width: toRem(145);
    margin-top: toRem(10);
  }

  &--founder {
    width: toRem(228);
    margin-top: toRem(10);
  }
}

.home-page__book-description-wrapper {
  display: flex;
  align-items: center;
  gap: toRem(20);
  margin: toRem(60) 0 toRem(200);
}

.home-page__book-description {
  font-size: toRem(24);
  line-height: 120%;
  font-weight: 400;
  white-space: pre-line;
}

.home-page__book-description-icon {
  max-width: toRem(50);
  max-height: toRem(45);
}

.home-page__most-popular {
  padding: toRem(100) 0;
  background-color: var(--background-quinary);
  background-image: url('/images/background-cubes-home-most-popular.png');
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: toRem(600);
}

.home-page__most-popular-wrapper {
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
}

.home-page__most-popular-title {
  text-align: center;
  font-weight: 700;
  font-size: toRem(40);
  color: var(--text-primary-invert-main);
}

.home-page__card-container {
  width: 100%;
  max-width: 100%;
  display: grid;
  justify-content: center;
  grid-gap: toRem(20);
  margin-top: toRem(30);
  grid-template-columns: repeat(auto-fill, minmax(toRem(390), 1fr));
}

.home-page__card {
  margin: 0 auto;
}

.home-page__view-all-btn {
  margin: toRem(70) auto toRem(20);
  padding: toRem(15) toRem(85);
  text-transform: uppercase;
}

.home-page__about-us {
  display: grid;
  padding: 0 toRem(100) 0 toRem(20);
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  grid-column-gap: toRem(90);
}

.home-page__about-us-content {
  padding: toRem(100) 0;
}

.home-page__about-us-title {
  font-size: toRem(40);
}

.home-page__about-us-text {
  font-size: toRem(18);
  margin-top: toRem(50);

  &:nth-child(2n) {
    margin-top: toRem(25);
  }
}

.home-page__founder {
  background-color: var(--background-quinary);
  background-image: url('/images/background-founder-cubes.png');
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: toRem(600);
}

.home-page__founder-content-wrapper {
  display: flex;
  column-gap: toRem(100);
  padding: toRem(45) var(--app-padding-right) toRem(80) var(--app-padding-left);
}

.home-page__founder-content-title {
  font-weight: 700;
  font-size: toRem(40);
  text-transform: uppercase;
  color: var(--text-primary-invert-main);
  margin-top: toRem(50);
}

.home-page__founder-content-subtitle {
  color: var(--text-primary-invert-main);
  font-size: toRem(20);
  text-transform: uppercase;
  margin-top: toRem(10);
}

.home-page__founder-content-description {
  color: var(--text-primary-invert-main);
  font-size: toRem(18);
  margin-top: toRem(55);
}
</style>
