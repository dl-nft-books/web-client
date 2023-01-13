import { i18n } from '@/localization'
import { errors } from '@/api/json-api'

export class ExpiredError extends Error {
  constructor(errorMessage = '') {
    super(errorMessage)
  }
}

export class FullyUsedError extends Error {
  constructor(errorMessage = '') {
    super(errorMessage)
  }
}

export const handlePromocodeError = (error: Error) => {
  const { t } = i18n.global

  switch (error.constructor) {
    case errors.NotFoundError:
      return t('purchase-book-form.promocode-invalid-msg')
    case ExpiredError:
      return t('purchase-book-form.promocode-expired-msg')
    case FullyUsedError:
      return t('purchase-book-form.promocode-used-msg')
    default:
      return t('errors.default')
  }
}
