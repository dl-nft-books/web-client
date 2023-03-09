<template>
  <div class="text-tool">
    <app-button
      class="text-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.textTool"
      @click="handleTextAdd"
    />
    <app-button
      class="text-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.boldText"
      @click="handleBoldSwitch"
    />
    <app-button
      class="text-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.italicText"
      @click="handleItalicSwitch"
    />
    <app-button
      class="text-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.fire"
      @click="handleFrameAdd"
    />
    <select-field v-model="currentFont" :value-options="fonts" />
    <select-field
      v-model="currentFontSize"
      class="text-tool__font-select"
      :value-options="fontSizes"
    />
    <!-- debug -->
    <app-button
      class="text-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.save"
      @click="download()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { AppButton } from '@/common'
import { SelectField } from '@/fields'
import { EditorInstanceKey } from '@image-editor/types'
import { safeInject } from '@image-editor/helpers'

// TODO: maybe think about showing styles of current selected text

enum Fonts {
  arial = 'Arial',
  timesNewRoman = 'Times New Roman',
  courierNew = 'Courier New',
  verdana = 'Verdana',
  comicSans = 'Comic Sans',
}

const DEFAULT_TEXT = 'Your unique signature'
const DEFAULT_FONT_SIZE = 24
const TEXT_COUNT_RESTRICTION = 5
const FONT_SIZE_STEP = 2
const FONT_SIZES_START = 10
// temporary
const fonts = [
  {
    label: 'Arial',
    value: Fonts.arial,
  },
  {
    label: 'Times New Roman',
    value: Fonts.timesNewRoman,
  },
  {
    label: 'Courier New',
    value: Fonts.courierNew,
  },
  {
    label: 'Verdana',
    value: Fonts.verdana,
  },
  {
    label: 'Comic Sans',
    value: Fonts.comicSans,
  },
]

const fontSizes = new Array(20).fill('').map((_, idx) => ({
  label: `${idx * FONT_SIZE_STEP + FONT_SIZES_START} pt`,
  value: idx * FONT_SIZE_STEP + FONT_SIZES_START,
}))

const textCount = ref(0)
const currentFont = ref<Fonts>(Fonts.arial)
const currentFontSize = ref(DEFAULT_FONT_SIZE)

const {
  instance: {
    addText,
    switchBoldness,
    switchItalic,
    changeFont,
    changeFontSize,
    addFrame,
    download,
  },
} = safeInject(EditorInstanceKey)

const handleFrameAdd = () => {
  addFrame('#00000', 2, 10)
}

const handleTextAdd = () => {
  if (textCount.value > TEXT_COUNT_RESTRICTION) return

  addText(DEFAULT_TEXT, {
    fontSize: DEFAULT_FONT_SIZE,
  })
  textCount.value++
}

const handleBoldSwitch = () => {
  switchBoldness()
}

const handleItalicSwitch = () => {
  switchItalic()
}

watch(currentFont, () => {
  changeFont(currentFont.value)
})

watch(currentFontSize, () => {
  changeFontSize(currentFontSize.value)
})
</script>

<style scoped lang="scss">
.text-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  gap: toRem(10);
  background-color: var(--background-primary);
  border-radius: toRem(8);
  padding: toRem(10);
  border: toRem(1) dashed var(--primary-main);

  @include respond-to(medium) {
    flex-direction: row;
  }
}

.text-tool__button {
  aspect-ratio: 1 / 1;

  --app-button-bg-hover: var(--primary-light);
  --app-button-border-hover: var(--primary-main);

  &--picked {
    background-color: var(--primary-light);
  }

  &:hover {
    cursor: pointer;
  }
}

.text-tool__font-select {
  min-width: toRem(95);
}
</style>
