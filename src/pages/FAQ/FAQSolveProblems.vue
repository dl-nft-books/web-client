<template>
  <div class="faq-solve-problems">
    <f-a-q-card-info :order-number="1">
      <template #header>
        <div>
          <span class="faq-solve-problems__phrase">
            {{ $t('faq-page.guide-4.abstract-1') }}
          </span>
          <span
            class="faq-solve-problems__phrase faq-solve-problems__phrase--bold"
          >
            {{ $t('faq-page.guide-4.abstract-1-acsent-word') }}
          </span>
          <span class="faq-solve-problems__phrase">
            {{ $t('faq-page.guide-4.abstract-1-continue') }}
          </span>
        </div>
      </template>
      <img
        class="faq-solve-problems__image faq-solve-problems__image--medium"
        src="/images/gas-control.png"
        alt="gas controls"
      />
    </f-a-q-card-info>
    <f-a-q-card-info :order-number="2">
      <template #header>
        <div>
          <span
            class="faq-solve-problems__phrase faq-solve-problems__phrase--bold"
          >
            {{ $t('faq-page.guide-4.abstract-2-acsent-word') }}
          </span>
          <span class="faq-solve-problems__phrase">
            {{ $t('faq-page.guide-4.abstract-2') }}
          </span>
        </div>
      </template>
      <img
        class="faq-solve-problems__image faq-solve-problems__image--medium"
        src="/images/transaction-retry.png"
        alt="transaction retry"
      />
    </f-a-q-card-info>
    <f-a-q-card-info :order-number="3" modification="col-span">
      <template #header>
        <div>
          <span
            class="faq-solve-problems__phrase faq-solve-problems__phrase--bold"
          >
            {{ $t('faq-page.guide-4.abstract-3-acsent-word') }}
          </span>
          <span class="faq-solve-problems__phrase">
            {{ $t('faq-page.guide-4.abstract-3') }}
          </span>
        </div>
      </template>
      <img
        class="faq-solve-problems__image faq-solve-problems__image--medium"
        src="/images/increase-fee.png"
        alt="increase fee"
      />
    </f-a-q-card-info>
  </div>
</template>

<script setup lang="ts">
import { FAQCardInfo } from '@/pages/FAQ'
</script>

<style scoped lang="scss">
.faq-solve-problems {
  @include guide-grid;
}

.faq-solve-problems__phrase {
  @include guide-phrase;
}

.faq-solve-problems__image {
  @include guide-image;
}
</style>
