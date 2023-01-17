import { TOKEN_TYPES } from '@/enums'
import { i18n } from '@/localization'

export function globalizeTokenType(type: string) {
  const { t } = i18n.global

  switch (type) {
    case TOKEN_TYPES.erc20:
      return t('token-types.erc20-lbl')
    case TOKEN_TYPES.native:
      return t('token-types.native-lbl')
    case TOKEN_TYPES.voucher:
      return t('token-types.voucher-lbl')
    default:
      return t('token-types.not-found-lbl')
  }
}
