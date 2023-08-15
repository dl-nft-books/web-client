import { ref, computed } from 'vue'
import { ethers } from 'ethers'
import { errors } from '@distributedlab/jac'

import { NftPrice, TokenPrice } from '@/types'
import { TOKEN_TYPES } from '@/enums'
import { BN } from '@/utils/math.util'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { useErc20, usePricer } from '@/composables'
import { ErrorHandler } from '@/helpers'
import { config } from '@/config'

export function useBalance() {
  const tokenPrice = ref<TokenPrice | null>(null)
  const nftPrice = ref<NftPrice | null>(null)
  const isTokenAddressUnsupported = ref(false)
  const balance = ref('')
  const isLoadFailed = ref(false)
  const isPriceAndBalanceLoaded = ref(false)

  const web3ProvidersStore = useWeb3ProvidersStore()
  const networkStore = useNetworksStore()
  const provider = computed(() => web3ProvidersStore.provider)
  const chainId = computed(() =>
    networkStore.list.some(
      network => network.chain_id === Number(provider.value.chainId),
    )
      ? Number(provider.value.chainId)
      : Number(config.DEFAULT_CHAIN_ID),
  )

  const { getPrice: _getPrice, getNftPrice } = usePricer()

  const getPrice = async (
    tokenAddress: string,
    tokenType: TOKEN_TYPES,
    chain = chainId.value,
  ) => {
    try {
      if (tokenType !== TOKEN_TYPES.nft) {
        const contract = tokenType === TOKEN_TYPES.erc20 ? tokenAddress : ''
        const { data } = await _getPrice(chain, contract)

        tokenPrice.value = data
        return
      }

      const { data } = await getNftPrice(chain, tokenAddress)

      nftPrice.value = data
    } catch (error) {
      if (error instanceof errors.NotFoundError) {
        isTokenAddressUnsupported.value = true
      }
      throw error
    }
  }

  const getErc20Balance = async (tokenAddress: string) => {
    if (!provider.value.address) return

    const erc20 = useErc20(provider, tokenAddress)
    const decimals = await erc20.getDecimals()
    const balance = await erc20.getBalanceOf(provider.value.address)

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
          provider.value.address!,
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
    chain = chainId.value,
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
        getPrice(tokenAddress, tokenType, chain),
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
