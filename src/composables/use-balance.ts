import { ref, computed } from 'vue'
import { ethers } from 'ethers'
import { errors } from '@/api/json-api'

import { getPriceByPlatform, getNftPriceByPlatform } from '@/api'
import { NftPrice, Platform, TokenPrice } from '@/types'
import { TOKEN_TYPES } from '@/enums'
import { BN } from '@/utils/math.util'
import { useWeb3ProvidersStore } from '@/store'
import { useErc20 } from '@/composables'
import { ErrorHandler } from '@/helpers'

export function useBalance(currentPlatform: Platform) {
  const tokenPrice = ref<TokenPrice | null>(null)
  const nftPrice = ref<NftPrice | null>(null)
  const isTokenAddressUnsupported = ref(false)
  const balance = ref('')
  const isLoadFailed = ref(false)
  const isPriceAndBalanceLoaded = ref(false)

  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const getPrice = async (tokenAddress: string, tokenType: TOKEN_TYPES) => {
    try {
      if (tokenType !== TOKEN_TYPES.nft) {
        const contract = tokenType === TOKEN_TYPES.erc20 ? tokenAddress : ''
        const { data } = await getPriceByPlatform(
          currentPlatform.id,
          contract,
          Number(provider.value.chainId),
        )

        tokenPrice.value = data
        return
      }

      const { data } = await getNftPriceByPlatform(
        currentPlatform.id,
        tokenAddress,
      )

      nftPrice.value = data
    } catch (error) {
      if (error instanceof errors.NotFoundError) {
        isTokenAddressUnsupported.value = true
      }
      throw error
    }
  }

  const getErc20Balance = async (tokenAddress: string) => {
    if (!provider.value.selectedAddress) return

    const erc20 = useErc20(tokenAddress)
    const decimals = await erc20.getDecimals()
    const balance = await erc20.getBalanceOf(provider.value.selectedAddress)

    if (!balance) return

    return new BN(balance.toString()).fromFraction(decimals).toString()
  }

  const getBalance = async (tokenAddress: string, tokenType: TOKEN_TYPES) => {
    let accountBalance: string | undefined

    switch (tokenType) {
      case TOKEN_TYPES.erc20:
        accountBalance = await getErc20Balance(tokenAddress)

        if (!accountBalance) return

        balance.value = accountBalance
        break
      case TOKEN_TYPES.native:
        accountBalance = await provider.value.getBalance(
          provider.value.selectedAddress!,
        )
        balance.value = new BN(accountBalance).fromWei().toString()
        break
      default:
        break
    }
  }

  const loadBalanceAndPrice = async (
    tokenAddress: string,
    tokenType: TOKEN_TYPES,
  ) => {
    tokenPrice.value = null
    balance.value = ''
    isLoadFailed.value = false

    /* 
      if paying with ERC20, we don't need to load balance until 
      user finishes input to tokenAddress field
    */
    if (
      tokenType !== TOKEN_TYPES.native &&
      !ethers.utils.isAddress(tokenAddress)
    )
      return

    isPriceAndBalanceLoaded.value = false
    isTokenAddressUnsupported.value = false

    try {
      await Promise.all([
        getPrice(tokenAddress, tokenType),
        getBalance(tokenAddress, tokenType),
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
    nftPrice,
    isTokenAddressUnsupported,
    balance,
    isLoadFailed,
    isPriceAndBalanceLoaded,
  }
}
