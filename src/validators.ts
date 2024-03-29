import {
  required as _required,
  requiredIf as _requiredIf,
  email as _email,
  minLength as _minLength,
  maxLength as _maxLength,
  sameAs as _sameAs,
  not as _not,
} from '@vuelidate/validators'
import { ValidationRule } from '@vuelidate/core'
import { Ref, unref } from 'vue'
import { createI18nMessage, MessageProps } from '@vuelidate/validators'
import { get } from 'lodash-es'
import { i18n } from '@/localization'
import { ethers } from 'ethers'
import { BnLike, BN } from '@/utils/math.util'

const { t } = i18n.global || i18n

const UrlSymbolsRegex = new RegExp(/^[\w-.~]+$/i)

const messagePath = ({ $validator }: MessageProps) =>
  `validations.field-error_${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

export const required = <ValidationRule>withI18nMessage(_required)

export const truthyValue = <ValidationRule>(
  withI18nMessage((value: unknown) => Boolean(value))
)

export const not = (validator: ValidationRule): ValidationRule =>
  <ValidationRule>withI18nMessage(_not(validator))

export const requiredIf = (prop: boolean | Ref<boolean>): ValidationRule =>
  <ValidationRule>withI18nMessage(_requiredIf(prop))

export const email = <ValidationRule>withI18nMessage(_email)

export const minLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_minLength(length))

export const maxLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_maxLength(length))

export const sameAs = (field: Ref): ValidationRule => {
  return <ValidationRule>withI18nMessage(_sameAs(field, get(field, '_key')))
}

export const urlSymbols = <ValidationRule>withI18nMessage((value: string) => {
  return !value ? true : UrlSymbolsRegex.test(value)
})

export const address = <ValidationRule>withI18nMessage({
  $validator: (address: string) => ethers.utils.isAddress(address),
  $params: {
    type: 'address',
  },
})

export const enoughBnAmount = (target: BnLike | Ref<BnLike>): ValidationRule =>
  <ValidationRule>(
    withI18nMessage(
      (amount: BnLike | Ref<BnLike>) =>
        new BN(unref(amount)).compare(unref(target)) >= 0,
    )
  )
