<template>
  <div class="faq-mobile-version">
    <faq-card-info :order-number="1">
      <template #header>
        <div>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-1') }}
          </span>

          <span
            class="faq-mobile-version__phrase faq-mobile-version__phrase--bold"
          >
            {{ $t('faq-mobile-version.abstract-1-acsent-word') }}
          </span>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-1-continue') }}
          </span>
        </div>
      </template>
      <img
        class="faq-mobile-version__image faq-mobile-version__image--medium"
        src="/images/mobile-bookshelf.png"
        :alt="$t('faq-mobile-version.alt-mobile-bookshelf')"
      />
    </faq-card-info>
    <faq-card-info :order-number="2">
      <template #header>
        <p class="faq-mobile-version__phrase">
          {{ $t('faq-mobile-version.abstract-2') }}
        </p>
      </template>
      <img
        class="faq-mobile-version__image faq-mobile-version__image--medium"
        src="/images/mobile-generation.png"
        :alt="$t('faq-mobile-version.alt-mobile-generation')"
      />
    </faq-card-info>
    <faq-card-info :order-number="3">
      <template #header>
        <p class="faq-mobile-version__phrase">
          {{ $t('faq-mobile-version.abstract-3') }}
        </p>
      </template>
      <img
        class="faq-mobile-version__image faq-mobile-version__image--medium"
        src="/images/mobile-payment.png"
        :alt="$t('faq-mobile-version.alt-mobile-payment')"
      />
    </faq-card-info>
    <faq-card-info :order-number="4">
      <template #header>
        <div>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-4') }}
          </span>
          <span
            class="faq-mobile-version__phrase faq-mobile-version__phrase--bold"
          >
            {{ $t('faq-mobile-version.abstract-4-acsent-word') }}
          </span>
        </div>
      </template>
      <img
        class="faq-mobile-version__image faq-mobile-version__image--small"
        src="/images/activity-tab.png"
        :alt="$t('faq-mobile-version.alt-activity-tab')"
      />
    </faq-card-info>
    <faq-card-info :order-number="5">
      <template #header>
        <p class="faq-mobile-version__phrase">
          {{ $t('faq-mobile-version.abstract-5') }}
        </p>
      </template>
      <img
        class="faq-mobile-version__image faq-mobile-version__image--small"
        src="/images/block-explorer.png"
        :alt="$t('faq-mobile-version.alt-block-explorer')"
      />
    </faq-card-info>
    <faq-card-info :order-number="6">
      <template #header>
        <div>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-6') }}
          </span>
          <span
            class="faq-mobile-version__phrase faq-mobile-version__phrase--bold"
          >
            {{ $t('faq-mobile-version.abstract-6-acsent-word-1') }}
          </span>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-6-continue') }}
          </span>
          <span
            class="faq-mobile-version__phrase faq-mobile-version__phrase--bold"
          >
            {{ $t('faq-mobile-version.abstract-6-acsent-word-2') }}
          </span>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-6-end') }}
          </span>
        </div>
      </template>
      <img
        class="faq-mobile-version__image faq-mobile-version__image--small"
        src="/images/transaction-action.png"
        :alt="$t('faq-mobile-version.alt-transaction-action')"
      />
    </faq-card-info>
    <faq-card-info :order-number="7">
      <template #header>
        <div>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-7') }}
          </span>
          <span
            class="faq-mobile-version__phrase faq-mobile-version__phrase--bold"
          >
            {{ $t('faq-mobile-version.abstract-7-acsent-word') }}
          </span>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-7-continue') }}
          </span>
        </div>
      </template>
      <img
        class="faq-mobile-version__image faq-mobile-version__image--medium"
        src="/images/import-nfts.png"
        :alt="$t('faq-mobile-version.alt-import-nfts')"
      />
    </faq-card-info>
    <faq-card-info :order-number="8">
      <template #header>
        <div>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-8') }}
          </span>
          <a :href="$t('faq-mobile-version.abstract-8-link')" target="_blank">
            {{ $t('faq-mobile-version.abstract-8-link') }}
          </a>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-8-continue') }}
          </span>
          <span
            class="faq-mobile-version__phrase faq-mobile-version__phrase--bold"
          >
            {{ $t('faq-mobile-version.abstract-8-acsent-word') }}
          </span>
          <span class="faq-mobile-version__phrase">
            {{ $t('faq-mobile-version.abstract-8-end') }}
          </span>
        </div>
      </template>
      <img
        class="faq-mobile-version__image faq-mobile-version__image--small"
        src="/images/mobile-details.png"
        :alt="$t('faq-mobile-version.alt-mobile-details')"
      />
    </faq-card-info>
  </div>
</template>

<script setup lang="ts">
import { FaqCardInfo } from '@/pages/faq'
</script>

<style scoped lang="scss">
.faq-mobile-version {
  @include guide-grid;
}

.faq-mobile-version__phrase {
  @include guide-phrase;
}

.faq-mobile-version__image {
  @include guide-image;
}
</style>
