import { Promocode } from '@/types'
import { reactive } from 'vue'
import { validatePromocode as _validatePromocode } from '@/api'
import {
  handlePromocodeError,
  PromocodeExpiredError,
  PromocodeFullyUsedError,
} from '@/helpers'
import { MAX_PROMOCODE_LENGTH, MIN_PROMOCODE_LENGTH } from '@/const'
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
        throw new PromocodeExpiredError()
      case PROMOCODE_STATUSES.FULLY_USED:
        throw new PromocodeFullyUsedError()
      default:
        break
    }
  }

  const validatePromocode = async (promocode: string) => {
    if (
      promocode.length > MAX_PROMOCODE_LENGTH ||
      promocode.length < MIN_PROMOCODE_LENGTH
    ) {
      promocodeInfo.promocode = null
      promocodeInfo.error = ''
      return
    }
    promocodeInfo.isLoading = true

    try {
      const { data } = await _validatePromocode(promocode)

      checkStatus(data.state)

      promocodeInfo.promocode = data.promocode
      promocodeInfo.error = ''
    } catch (error) {
      promocodeInfo.error = handlePromocodeError(error as Error)
      promocodeInfo.promocode = null
    }
    promocodeInfo.isLoading = false
  }

  return {
    promocodeInfo,
    validatePromocode,
  }
}
