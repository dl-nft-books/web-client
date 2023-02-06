<template>
  <ul class="faq-metamask-list">
    <li class="faq-metamask-list__item">
      {{ $t('faq-metamask.abstract-3-point-1') }}
    </li>
    <li class="faq-metamask-list__item">
      {{ $t('faq-metamask.abstract-3-point-2') }}
    </li>
    <p
      :class="[
        'faq-metamask-list__text',
        'faq-metamask-list__text--italic',
        'faq-metamask-list__text--color-dark',
        'faq-metamask-list__item-subtitle',
      ]"
    >
      {{ $t('faq-metamask.abstract-3-point-2-subtitle') }}
    </p>
    <li class="faq-metamask-list__item">
      {{ $t('faq-metamask.abstract-3-point-3') }}
    </li>
    <p
      :class="[
        'faq-metamask-list__text',
        'faq-metamask-list__text--italic',
        'faq-metamask-list__text--color-dark',
        'faq-metamask-list__item-subtitle',
      ]"
    >
      {{ $t('faq-metamask.abstract-3-point-3-subtitle') }}
    </p>
  </ul>
</template>

<style scoped lang="scss">
.faq-metamask-list {
  padding-left: toRem(40);
}

.faq-metamask-list__text {
  @include guide-phrase;
}

.faq-metamask-list__item {
  &:before {
    content: '•';
    position: relative;
    color: var(--primary-main);
    top: toRem(5);
    padding-right: toRem(10);
    font-size: toRem(30);
  }
}

.faq-metamask-list__item-subtitle {
  padding-left: toRem(18);
  padding-top: toRem(5);
}
</style>
