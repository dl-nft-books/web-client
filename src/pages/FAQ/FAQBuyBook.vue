<template>
  <div class="faq-buy-book">
    <f-a-q-card-info :order-number="1">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-1') }}
          </span>
          <a :href="$t('faq-page.guide-2.abstract-1-link')" target="_blank">
            {{ $t('faq-page.guide-2.abstract-1-link') }}
          </a>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-1-continue') }}
          </span>
          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-page.guide-2.abstract-1-acsent-word') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/connect-metamask.png"
        alt="main page example"
      />
    </f-a-q-card-info>
    <f-a-q-card-info :order-number="2">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-2') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-page.guide-2.abstract-2-acsent-word-1') }}
          </span>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-2-continue') }}
          </span>
          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-page.guide-2.abstract-2-acsent-word-2') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/buy-book.png"
        alt="buy book"
      />
    </f-a-q-card-info>
    <f-a-q-card-info :order-number="3">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-3') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-page.guide-2.abstract-3-acsent-word') }}
          </span>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-3-continue') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/signature.png"
        alt="buy book"
      />
    </f-a-q-card-info>
    <f-a-q-card-info :order-number="4">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-4') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-page.guide-2.abstract-4-acsent-word') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/my-nfts.png"
        alt="buy book"
      />
    </f-a-q-card-info>
    <f-a-q-card-info :order-number="5">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-5') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-page.guide-2.abstract-5-acsent-word') }}
          </span>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-5-continue') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/details.png"
        alt="details"
      />
    </f-a-q-card-info>
    <f-a-q-card-info :order-number="6">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-6') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-page.guide-2.abstract-6-acsent-word-1') }}
          </span>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-page.guide-2.abstract-6-continue') }}
          </span>
          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-page.guide-2.abstract-6-acsent-word-2') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/manual-import.png"
        alt="details"
      />
    </f-a-q-card-info>
  </div>
</template>

<script setup lang="ts">
import { FAQCardInfo } from '@/pages/FAQ'
</script>

<style scoped lang="scss">
.faq-buy-book {
  @include guide-grid;
}

.faq-buy-book__phrase {
  @include guide-phrase;
}

.faq-buy-book__image {
  @include guide-image;
}
</style>
