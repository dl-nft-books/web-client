<template>
  <div class="faq-solve-problems">
    <faq-card-info :order-number="1">
      <template #header>
        <div>
          <span class="faq-solve-problems__phrase">
            {{ $t('faq-solve-problems.abstract-1') }}
          </span>
          <span
            class="faq-solve-problems__phrase faq-solve-problems__phrase--bold"
          >
            {{ $t('faq-solve-problems.abstract-1-acsent-word') }}
          </span>
          <span class="faq-solve-problems__phrase">
            {{ $t('faq-solve-problems.abstract-1-continue') }}
          </span>
        </div>
      </template>
      <img
        class="faq-solve-problems__image faq-solve-problems__image--medium"
        src="/images/gas-control.png"
        :alt="$t('faq-solve-problems.alt-gas-control')"
      />
    </faq-card-info>
    <faq-card-info :order-number="2">
      <template #header>
        <div>
          <span
            class="faq-solve-problems__phrase faq-solve-problems__phrase--bold"
          >
            {{ $t('faq-solve-problems.abstract-2-acsent-word') }}
          </span>
          <span class="faq-solve-problems__phrase">
            {{ $t('faq-solve-problems.abstract-2') }}
          </span>
        </div>
      </template>
      <img
        class="faq-solve-problems__image faq-solve-problems__image--medium"
        src="/images/transaction-retry.png"
        :alt="$t('faq-solve-problems.alt-transaction-retry')"
      />
    </faq-card-info>
    <faq-card-info :order-number="3" modification="col-span">
      <template #header>
        <div>
          <span
            class="faq-solve-problems__phrase faq-solve-problems__phrase--bold"
          >
            {{ $t('faq-solve-problems.abstract-3-acsent-word') }}
          </span>
          <span class="faq-solve-problems__phrase">
            {{ $t('faq-solve-problems.abstract-3') }}
          </span>
        </div>
      </template>
      <img
        class="faq-solve-problems__image faq-solve-problems__image--medium"
        src="/images/increase-fee.png"
        :alt="$t('faq-solve-problems.alt-increase-fee')"
      />
    </faq-card-info>
  </div>
</template>

<script setup lang="ts">
import { FaqCardInfo } from '@/pages/faq'
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
