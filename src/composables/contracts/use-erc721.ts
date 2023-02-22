import { ref, watch, computed } from 'vue'
import { Erc721, Erc721__factory } from '@/types'
import { useWeb3ProvidersStore } from '@/store'

export const useErc721 = (address?: string) => {
  const _instance = ref<Erc721 | undefined>()
  const _instance_rw = ref<Erc721 | undefined>()

  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  watch(provider, () => {
    if (address) init(address)
  })

  if (
    address &&
    provider.value.currentProvider &&
    provider.value.currentSigner
  ) {
    _instance.value = Erc721__factory.connect(
      address,
      provider.value.currentProvider,
    )
    _instance_rw.value = Erc721__factory.connect(
      address,
      provider.value.currentSigner,
    )
  }

  const init = (address: string) => {
    if (
      address &&
      provider.value.currentProvider &&
      provider.value.currentSigner
    ) {
      _instance.value = Erc721__factory.connect(
        address,
        provider.value.currentProvider,
      )
      _instance_rw.value = Erc721__factory.connect(
        address,
        provider.value.currentSigner,
      )
    }
  }

  const approve = async (to: string, tokenId: string) => {
    const tx = await _instance_rw.value?.approve(to, tokenId)
    await tx?.wait()
    return tx
  }

  const getBalanceOf = async (address: string) => {
    const _balance = await _instance.value?.balanceOf(address)

    return _balance ? _balance.toString() : ''
  }

  const getName = async () => {
    if (_instance.value?.name) {
      return await _instance.value?.name()
    }
  }

  const getOwner = async (tokenId: string) => {
    if (_instance.value?.ownerOf) {
      return await _instance.value?.ownerOf(tokenId)
    }
  }

  const getSymbol = async () => {
    if (_instance.value?.symbol) {
      return await _instance.value?.symbol()
    }
  }
  return {
    init,

    approve,
    getBalanceOf,

    getName,
    getOwner,
    getSymbol,
  }
}
