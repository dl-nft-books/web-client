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
      :class="{
        'text-tool__button--picked': isBold,
      }"
      :icon-left="$icons.boldText"
      @click="handleBoldSwitch"
    />
    <app-button
      class="text-tool__button"
      scheme="default"
      icon-size="large"
      :icon-left="$icons.italicText"
      :class="{
        'text-tool__button--picked': isItalic,
      }"
      @click="handleItalicSwitch"
    />
    <select-field v-model="currentFont" :value-options="fonts" />
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
import { fabric } from 'fabric'
import { ref, watch } from 'vue'
import { AppButton } from '@/common'
import { SelectField } from '@/fields'
import { EditorInstanceKey } from '@image-editor/types'
import { safeInject } from '@image-editor/helpers'

enum Fonts {
  arial = 'Arial',
  timesNewRoman = 'Times New Roman',
  courierNew = 'Courier New',
  verdana = 'Verdana',
  comicSans = 'Comic Sans',
}

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
const DEFAULT_TEXT = 'Your unique signature'
const TEXT_COUNT_RESTRICTION = 5

const textCount = ref(0)
const currentFont = ref<Fonts>(Fonts.arial)
const isBold = ref(false)
const isItalic = ref(false)

const {
  instance: {
    addText,
    switchBoldness,
    switchItalic,
    changeFont,
    download,
    activeObject,
  },
} = safeInject(EditorInstanceKey)

const handleTextAdd = () => {
  if (textCount.value > TEXT_COUNT_RESTRICTION) return

  addText(DEFAULT_TEXT)
  textCount.value++
}

const handleBoldSwitch = () => {
  switchBoldness()

  isBold.value = !isBold.value
}

const handleItalicSwitch = () => {
  switchItalic()

  isItalic.value = !isItalic.value
}

const resetSetting = () => {
  currentFont.value = Fonts.arial
  isBold.value = false
  isItalic.value = false
}

watch(activeObject, () => {
  if (!activeObject.value) {
    resetSetting()
    return
  }

  if (activeObject.value instanceof fabric.IText) {
    currentFont.value = activeObject.value.fontFamily as Fonts
    isBold.value = activeObject.value.fontWeight === 'bold'
    isItalic.value = activeObject.value.fontStyle === 'italic'
  }
})

watch(currentFont, () => {
  changeFont(currentFont.value)
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
</style>
