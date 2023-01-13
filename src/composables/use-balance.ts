import { ref } from 'vue'
import { ethers } from 'ethers'
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

  const { provider } = useWeb3ProvidersStore()
  const erc20 = useErc20(provider)

  const getPrice = async (
    isTokenAddressRequired: boolean,
    tokenAddress: string,
  ) => {
    try {
      const contract = isTokenAddressRequired ? tokenAddress : ''
      const { data } = await getPriceByPlatform(currentPlatform.id, contract)
      tokenPrice.value = data
    } catch (error) {
      if (error instanceof errors.NotFoundError) {
        isTokenAddressUnsupported.value = true
      }
      throw error
    }
  }

  const getBalance = async (
    isTokenAddressRequired: boolean,
    tokenAddress: string,
  ) => {
    if (isTokenAddressRequired) {
      erc20.init(tokenAddress)
      await erc20.getDecimals()
      const accountBalance = await erc20.getBalanceOf(provider.selectedAddress!)
      balance.value = new BN(accountBalance)
        .fromFraction(erc20.decimals.value)
        .toString()
    } else {
      const accountBalance = await provider.getBalance(
        provider.selectedAddress!,
      )
      balance.value = new BN(accountBalance).fromWei().toString()
    }
  }

  const loadBalanceAndPrice = async (
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
