import { defineStore } from 'pinia'
import { Network } from '@/types'
import { getNetworks } from '@/api'

export const useNetworksStore = defineStore('networks', {
  state: () => ({
    list: [] as Network[],
  }),
  actions: {
    async loadNetworks(): Promise<void> {
      const { data: networks } = await getNetworks()

      this.list = networks
    },

    getNetworkByID(id: number): Network | undefined {
      return this.list.find(network => network.chain_id === id)
    },
  },
})
