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

  const getPrice = async (tokenAddress: string, isERC20Token: boolean) => {
    try {
      const contract = isERC20Token ? tokenAddress : ''
      const { data } = await getPriceByPlatform(currentPlatform.id, contract)
      tokenPrice.value = data
    } catch (error) {
      if (error instanceof errors.NotFoundError) {
        isTokenAddressUnsupported.value = true
      }
      throw error
    }
  }

  const getBalance = async (tokenAddress: string, isERC20Token: boolean) => {
    if (isERC20Token) {
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

  /* 
    boolean variable isERC20Token appears here to understand whether user trying
    to pay for the book with ERC20 or not

    using only tokenAddress variable it isn't possible to determine what token
    type is picked by user in this moment

    Example: user picks ERC20, inputs some data, then switching back to Native.
    In that case tokenAddress is not equal to empty string, but it doesn`t mean
    that we need load balance for ERC20 token.
  */
  const loadBalanceAndPrice = async (
    tokenAddress: string,
    isERC20Token: boolean,
  ) => {
    tokenPrice.value = null
    balance.value = ''
    isLoadFailed.value = false

    /* 
      if paying with ERC20, we don't need to load balance until 
      user finishes input to tokenAddress field
    */
    if (isERC20Token && !ethers.utils.isAddress(tokenAddress)) return

    isPriceAndBalanceLoaded.value = false
    isTokenAddressUnsupported.value = false

    try {
      await Promise.all([
        getPrice(tokenAddress, isERC20Token),
        getBalance(tokenAddress, isERC20Token),
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
