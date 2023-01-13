import { Promocode } from '@/types'
import { reactive } from 'vue'
import { validatePromocode as _validatePromocode } from '@/api'
import {
  ErrorHandler,
  handlePromocodeError,
  ExpiredError,
  FullyUsedError,
} from '@/helpers'
import { PROMOCODE_LENGTH } from '@/const'
import { PROMOCODE_STATUSES } from '@/enums'

export function usePromocode() {
  const promocodeInfo = reactive({
    isLoading: false,
    promocode: null as Promocode | null,
    error: '',
  })

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
        promocodeInfo.error = handlePromocodeError(error)
        promocodeInfo.promocode = null
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
