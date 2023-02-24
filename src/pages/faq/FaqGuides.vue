<template>
  <div class="faq-guides">
    <div class="faq-guides__background" />
    <section class="faq-guides__content">
      <faq-guides-switcher
        v-model="currentGuide"
        :switcher-list="guides"
        :guide-list="guideList"
      />
      <div ref="guideRef" class="faq-guides__guides">
        <div
          v-for="(item, index) in guides"
          :key="index"
          :ref="
            el =>
              guideList.push({
                ref: el,
                id: item.value,
              })
          "
        >
          <faq-guide-item
            :id="item.value"
            class="faq-guides__item"
            :guide="item"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { FaqGuidesSwitcher, FaqGuideItem } from '@/pages/faq'
import { GUIDES } from '@/enums'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const guides = [
  {
    title: t('faq-metamask.title'),
    value: GUIDES.metamask,
  },
  {
    title: t('faq-buy-book.title'),
    value: GUIDES.buyBook,
  },
  {
    title: t('faq-mobile-version.title'),
    value: GUIDES.mobile,
  },
  {
    title: t('faq-solve-problems.title'),
    value: GUIDES.problems,
  },
]

const currentGuide = ref(guides[0])
const guideList = ref<
  Array<{
    ref: Ref<HTMLElement | null>
    id: GUIDES
  }>
>([])
const guideRef = ref<HTMLElement | null>(null)

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentGuide.value = guides.find(
          guide => guide.value === entry.target.id,
        )
      }
    })
  },
  { threshold: 0.1 },
)

onMounted(() => {
  if (!guideRef.value) return

  for (const guideSection of guideRef.value.getElementsByClassName(
    'faq-guides__item',
  )) {
    observer.observe(guideSection)
  }
})
</script>

<style scoped lang="scss">
.faq-guides {
  background: var(--background-primary);
  padding: toRem(40) toRem(20);
  min-height: toRem(300);
  width: 100%;
  position: relative;
}

.faq-guides__guides {
  display: flex;
  flex-direction: column;
  gap: toRem(40);
}

.faq-guides__background {
  width: 100%;
  height: vh(80);
  position: absolute;
  z-index: var(--z-index-layer-1);
  background: url('/images/cube-left.png') no-repeat left top / contain;
  background-size: 23%;
  opacity: 0.5;
  left: 0;
  top: 0;
}

.faq-guides__content {
  position: relative;
  height: fit-content;
  z-index: var(--z-index-layer-2);
  display: grid;
  grid-template-columns: 30% 70%;
  justify-content: center;
  align-items: start;
  gap: toRem(40);
  padding: 0 toRem(100);

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 toRem(20);
  }
}
</style>
