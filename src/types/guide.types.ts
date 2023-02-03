export type GuideImageSize = 'medium' | 'small' | 'x-small'

export type GuidePhrase = {
  value: string
  component: 'span' | 'a' | 'p'
  attrs: { [key: string]: string }
  isBold?: boolean
}

type ImageData = {
  alt: string
  src: string
  size: GuideImageSize
  label?: string
}

export type GuideInfo = {
  text: GuidePhrase[]
  img?: ImageData[]
  hasList?: boolean
}
