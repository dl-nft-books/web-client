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

  const getPrice = async (tokenAddress: string) => {
    try {
      const { data } = await getPriceByPlatform(
        currentPlatform.id,
        tokenAddress,
      )
      tokenPrice.value = data
    } catch (error) {
      if (error instanceof errors.NotFoundError) {
        isTokenAddressUnsupported.value = true
      }
      throw error
    }
  }

  const getBalance = async (tokenAddress: string) => {
    if (tokenAddress) {
      erc20.init(tokenAddress)
      await erc20.getDecimals()
      const accountBalance = await erc20.getBalanceOf(
        provider.value.selectedAddress!,
      )
      balance.value = new BN(accountBalance)
        .fromFraction(erc20.decimals.value)
        .toString()
      return
    }

    const accountBalance = await provider.value.getBalance(
      provider.value.selectedAddress!,
    )
    balance.value = new BN(accountBalance).fromWei().toString()
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
      await Promise.all([getPrice(tokenAddress), getBalance(tokenAddress)])
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
