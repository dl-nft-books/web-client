import { DateUtil } from '@/utils/date.util'
import { ConfigType } from 'dayjs'

export function formatMDY(date: ConfigType) {
  return DateUtil._instance(date).format('MMMM D, YYYY')
}
