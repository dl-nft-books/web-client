<template>
  <div class="faq-buy-book">
    <faq-card-info :order-number="1">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-1') }}
          </span>
          <a :href="$t('faq-buy-book.abstract-1-link')" target="_blank">
            {{ $t('faq-buy-book.abstract-1-link') }}
          </a>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-1-continue') }}
          </span>
          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-buy-book.abstract-1-acsent-word') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/connect-metamask.png"
        :alt="$t('faq-buy-book.alt-connect-metamask')"
      />
    </faq-card-info>
    <faq-card-info :order-number="2">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-2') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-buy-book.abstract-2-acsent-word-1') }}
          </span>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-2-continue') }}
          </span>
          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-buy-book.abstract-2-acsent-word-2') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/buy-book.png"
        :alt="$t('faq-buy-book.alt-buy-book')"
      />
    </faq-card-info>
    <faq-card-info :order-number="3">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-3') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-buy-book.abstract-3-acsent-word') }}
          </span>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-3-continue') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/signature.png"
        :alt="$t('faq-buy-book.alt-signature')"
      />
    </faq-card-info>
    <faq-card-info :order-number="4">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-4') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-buy-book.abstract-4-acsent-word') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/my-nfts.png"
        :alt="$t('faq-buy-book.alt-my-nfts')"
      />
    </faq-card-info>
    <faq-card-info :order-number="5">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-5') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-buy-book.abstract-5-acsent-word') }}
          </span>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-5-continue') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/details.png"
        :alt="$t('faq-buy-book.alt-details')"
      />
    </faq-card-info>
    <faq-card-info :order-number="6">
      <template #header>
        <div>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-6') }}
          </span>

          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-buy-book.abstract-6-acsent-word-1') }}
          </span>
          <span class="faq-buy-book__phrase">
            {{ $t('faq-buy-book.abstract-6-continue') }}
          </span>
          <span class="faq-buy-book__phrase faq-buy-book__phrase--bold">
            {{ $t('faq-buy-book.abstract-6-acsent-word-2') }}
          </span>
        </div>
      </template>
      <img
        class="faq-buy-book__image faq-buy-book__image--medium"
        src="/images/manual-import.png"
        :alt="$t('faq-buy-book.alt-manual-import')"
      />
    </faq-card-info>
  </div>
</template>

<script setup lang="ts">
import { FaqCardInfo } from '@/pages/faq'
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
