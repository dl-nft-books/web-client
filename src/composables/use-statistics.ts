import { api } from '@/api'

import { GeneralStatistics, StatisticsByBook } from '@/types'
import { flattenNestedResponseData } from '@/helpers'

export function useStatistics() {
  const getStatistics = async () => {
    const { data } = await api.get<GeneralStatistics>(
      '/integrations/tracker/statistics',
    )

    return flattenNestedResponseData(data)
  }

  const getStatisticByBookId = async (id: string) => {
    const { data } = await api.get<StatisticsByBook>(
      `/integrations/tracker/statistics/${id}`,
    )

    return flattenNestedResponseData(data)
  }

  return {
    getStatistics,
    getStatisticByBookId,
  }
}
