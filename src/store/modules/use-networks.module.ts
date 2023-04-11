import { defineStore } from 'pinia'
import { Network, PageOrder } from '@/types'
import { api } from '@/api'
import { config } from '@/config'

export const useNetworksStore = defineStore('networks', {
  state: () => ({
    list: [] as Network[],
  }),
  actions: {
    async loadNetworks(opts?: {
      pageLimit?: number
      pageOrder?: PageOrder
    }): Promise<void> {
      const { data: networks } = await api.get<Network[]>(
        '/integrations/networks',
        {
          page: {
            limit: opts?.pageLimit || config.DEFAULT_PAGE_LIMIT,
            order: opts?.pageOrder || 'desc',
          },
        },
      )

      this.list = networks
    },

    getNetworkByID(id: number): Network | undefined {
      return this.list.find(network => network.chain_id === id)
    },
  },
})
