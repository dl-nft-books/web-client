import { i18n } from '@/localization'
import { errors } from '@distributedlab/jac'

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
      return t('promocode-template.promocode-invalid-msg')
    case PromocodeExpiredError:
      return t('promocode-template.promocode-expired-msg')
    case PromocodeFullyUsedError:
      return t('promocode-template.promocode-used-msg')
    default:
      return t('errors.default')
  }
}
