import { ref, watch } from 'vue'
import { Erc721, Erc721__factory, UnrefProvider } from '@/types'

export const useErc721 = (provider: UnrefProvider, address?: string) => {
  const _instance = ref<Erc721 | undefined>()
  const _instance_rw = ref<Erc721 | undefined>()

  watch(provider, () => {
    if (address) init(address)
  })

  if (address && provider.currentProvider && provider.currentSigner) {
    _instance.value = Erc721__factory.connect(address, provider.currentProvider)
    _instance_rw.value = Erc721__factory.connect(
      address,
      provider.currentSigner,
    )
  }

  const init = (address: string) => {
    if (address && provider.currentProvider && provider.currentSigner) {
      _instance.value = Erc721__factory.connect(
        address,
        provider.currentProvider,
      )
      _instance_rw.value = Erc721__factory.connect(
        address,
        provider.currentSigner,
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
