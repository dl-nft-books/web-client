import { DateUtil } from '@distributedlab/utils'
import { ConfigType } from 'dayjs'

export function formatMDY(date: ConfigType) {
  return DateUtil.format(date, 'MMMM D, YYYY')
}
