import { defineStore } from 'pinia'
import { Network, PageOrder } from '@/types'
import { api } from '@/api'
import { config } from '@/config'

type ChainInfo = {
  name: string
  chainId: number
}

const chainListLink = 'https://chainid.network/chains_mini.json'

export const useNetworksStore = defineStore('networks', {
  state: () => ({
    list: [] as Network[],
    chainList: [] as ChainInfo[],
  }),
  actions: {
    // Loads supported network from backend
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

    // Loads chain list to find info about unsupported chains
    async loadChainList() {
      const data = await (await fetch(chainListLink)).json()
      this.chainList = data
    },

    getChainByID(id: number): ChainInfo | undefined {
      return this.chainList.find(chain => chain.chainId === id)
    },

    getNetworkByID(id: number): Network | undefined {
      return this.list.find(network => network.chain_id === id)
    },
  },
})
