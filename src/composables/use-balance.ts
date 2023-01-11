import { ref } from 'vue'
import { debounce } from 'lodash'
import { ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import { errors } from '@/api/json-api'

import { getPriceByPlatform } from '@/api'
import { Platform, TokenPrice } from '@/types'
import { BN } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { useErc20 } from '@/composables'
import { ErrorHandler } from '@/helpers'

export function useBalance(currentPlatform: Platform) {
  const tokenPrice = ref<TokenPrice | null>(null)
  const isTokenAddressUnsupported = ref(false)
  const balance = ref('')
  const isLoadFailed = ref(false)
  const isPriceAndBalanceLoaded = ref(false)

  const { provider } = storeToRefs(useWeb3ProvidersStore())
  const erc20 = useErc20(provider.value)

  const getPrice = async (
    isTokenAddressRequired: boolean,
    tokenAddress: string,
  ) => {
    try {
      const contract = isTokenAddressRequired ? tokenAddress : ''
      const { data } = await getPriceByPlatform(currentPlatform.id, contract)
      tokenPrice.value = data
    } catch (e) {
      if (e instanceof errors.NotFoundError) {
        isTokenAddressUnsupported.value = true
      }
      throw e
    }
  }

  const getBalance = async (
    isTokenAddressRequired: boolean,
    tokenAddress: string,
  ) => {
    if (isTokenAddressRequired) {
      erc20.init(tokenAddress)
      await erc20.getDecimals()
      const blnc = await erc20.getBalanceOf(provider.value.selectedAddress!)
      balance.value = new BN(blnc).fromFraction(erc20.decimals.value).toString()
    } else {
      const blnc = await provider.value.getBalance(
        provider.value.selectedAddress!,
      )
      balance.value = new BN(blnc).fromWei().toString()
    }
  }

  const _loadBalanceAndPrice = async (
    isTokenAddressRequired: boolean,
    tokenAddress: string,
  ) => {
    tokenPrice.value = null
    balance.value = ''
    isLoadFailed.value = false

    if (isTokenAddressRequired && !ethers.utils.isAddress(tokenAddress)) return

    isPriceAndBalanceLoaded.value = false
    isTokenAddressUnsupported.value = false

    try {
      await Promise.all([
        getPrice(isTokenAddressRequired, tokenAddress),
        getBalance(isTokenAddressRequired, tokenAddress),
      ])
    } catch (e) {
      isLoadFailed.value = true
      ErrorHandler.processWithoutFeedback(e)
    }

    isPriceAndBalanceLoaded.value = true
  }

  const loadBalanceAndPrice = debounce(_loadBalanceAndPrice, 400)

  return {
    getPrice,
    getBalance,
    loadBalanceAndPrice,
    tokenPrice,
    isTokenAddressUnsupported,
    balance,
    isLoadFailed,
    isPriceAndBalanceLoaded,
  }
}
