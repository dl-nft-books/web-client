import { Promocode } from '@/types'
import { reactive } from 'vue'
import { validatePromocode as _validatePromocode } from '@/api'
import { errors } from '@/api/json-api'
import { useI18n } from 'vue-i18n'
import { ErrorHandler } from '@/helpers'
import { PROMOCODE_LENGTH } from '@/const'
import { PROMOCODE_STATUSES } from '@/enums'

class ExpiredError extends Error {
  constructor(errorMessage = '') {
    super(errorMessage)
  }
}

class FullyUsedError extends Error {
  constructor(errorMessage = '') {
    super(errorMessage)
  }
}

export function usePromocode() {
  const promocodeInfo = reactive({
    isLoading: false,
    promocode: null as Promocode | null,
    error: '',
  })

  const { t } = useI18n({ useScope: 'global' })

  const checkStatus = (state: PROMOCODE_STATUSES) => {
    if (state !== PROMOCODE_STATUSES.ACTIVE) {
      promocodeInfo.promocode = null
    }

    switch (state) {
      case PROMOCODE_STATUSES.EXPIRED:
        throw new ExpiredError()
      case PROMOCODE_STATUSES.FULLY_USED:
        throw new FullyUsedError()
      default:
        break
    }
  }

  const handlePromocodeError = (error: Error) => {
    switch (error.constructor) {
      case errors.NotFoundError:
        promocodeInfo.error = t('purchase-book-form.promocode-invalid-msg')
        promocodeInfo.promocode = null
        return
      case ExpiredError:
        promocodeInfo.error = t('purchase-book-form.promocode-expired-msg')
        return
      case FullyUsedError:
        promocodeInfo.error = t('purchase-book-form.promocode-used-msg')
        return
      default:
        break
    }
  }

  const validatePromocode = async (promocode: string) => {
    try {
      if (promocode.length !== PROMOCODE_LENGTH) {
        promocodeInfo.promocode = null
        promocodeInfo.error = ''
        return
      }

      promocodeInfo.isLoading = true
      const { data } = await _validatePromocode(promocode)

      checkStatus(data.state)

      promocodeInfo.promocode = data.promocode
      promocodeInfo.isLoading = false
      promocodeInfo.error = ''
    } catch (error) {
      promocodeInfo.isLoading = false
      if (error instanceof Error) {
        handlePromocodeError(error)
        return
      }
      ErrorHandler.process(error)
    }
  }

  return {
    promocodeInfo,
    validatePromocode,
  }
}
