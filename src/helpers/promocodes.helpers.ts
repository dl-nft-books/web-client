import { i18n } from '@/localization'
import { errors } from '@/api/json-api'

export class PromocodeExpiredError extends Error {
  constructor(errorMessage = '') {
    super(errorMessage)
  }
}

export class PromocodeFullyUsedError extends Error {
  constructor(errorMessage = '') {
    super(errorMessage)
  }
}

export const handlePromocodeError = (error: Error) => {
  const { t } = i18n.global

  switch (error.constructor) {
    case errors.NotFoundError:
      return t('purchase-book-form.promocode-invalid-msg')
    case PromocodeExpiredError:
      return t('purchase-book-form.promocode-expired-msg')
    case PromocodeFullyUsedError:
      return t('purchase-book-form.promocode-used-msg')
    default:
      return t('errors.default')
  }
}
