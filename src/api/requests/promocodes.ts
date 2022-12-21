import { api } from '@/api'
import { PromocodeValidation } from '@/types'

export function validatePromocode(promocode: string) {
  return api.get<PromocodeValidation>(
    `/integrations/generator/promocodes/validate/${promocode}`,
  )
}
