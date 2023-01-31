import { ref, watch } from 'vue'
import { BN } from '@/utils/math.util'
import { Erc20, Erc20__factory, NativeCurrency } from '@/types'
import { ethers } from 'ethers'

import {
  DesignatedProvider,
  ChainId,
  TransactionResponse,
  TxRequestBody,
  EthProviderRpcError,
} from '@/types'
import { PROVIDERS } from '@/enums'
import { handleEthError } from '@/helpers'

export interface UseUnrefProvider {
  currentProvider: ethers.providers.Web3Provider | undefined
  currentSigner: ethers.providers.JsonRpcSigner | undefined

  selectedProvider: PROVIDERS | undefined
  chainId: ChainId | undefined
  selectedAddress: string | undefined
  isConnected: boolean

  init: (provider: DesignatedProvider) => Promise<void>
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: ChainId) => Promise<void>
  addChain: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
    nativeCurrency: NativeCurrency,
    blockExplorerUrl: string,
  ) => Promise<void>
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
}

export const useErc20 = (provider: UseUnrefProvider, address?: string) => {
  const _instance = ref<Erc20 | undefined>()
  const _instance_rw = ref<Erc20 | undefined>()

  watch(provider, () => {
    if (address) init(address)
  })

  if (address && provider.currentProvider && provider.currentSigner) {
    _instance.value = Erc20__factory.connect(address, provider.currentProvider)
    _instance_rw.value = Erc20__factory.connect(address, provider.currentSigner)
  }

  const init = (address: string) => {
    if (address && provider.currentProvider && provider.currentSigner) {
      _instance.value = Erc20__factory.connect(
        address,
        provider.currentProvider,
      )
      _instance_rw.value = Erc20__factory.connect(
        address,
        provider.currentSigner,
      )
    }
  }

  const allowance = ref('')

  const decimals = ref<number | undefined>()

  const name = ref('')

  const owner = ref('')

  const symbol = ref('')

  const totalSupply = ref('')

  const balance = ref('')

  const loadDetails = async () => {
    if (!_instance.value) return

    await Promise.all([
      getDecimals(),
      getName(),
      getOwner(),
      getSymbol(),
      getTotalSupply(),
    ])
    if (provider.currentSigner) {
      balance.value = await getBalanceOf(
        await provider.currentSigner?.getAddress(),
      )
    }
  }

  const approve = async (spender: string, amount: string) => {
    const tx = await _instance_rw.value?.approve(spender, amount)
    return tx
  }

  const decreaseAllowance = async (
    spender: string,
    subtractedValue: number,
  ) => {
    await _instance_rw.value?.decreaseAllowance(
      spender,
      new BN(subtractedValue).toFraction(decimals.value).toString(),
    )
  }

  const increaseAllowance = async (spender: string, addedValue: number) => {
    await _instance_rw.value?.increaseAllowance(
      spender,
      new BN(addedValue).toFraction(decimals.value).toString(),
    )
  }

  const mint = async (to: string, amount: number) => {
    await _instance_rw.value?.mint(
      to,
      new BN(amount).toFraction(decimals.value).toString(),
    )
  }

  const renounceOwnership = async () => {
    await _instance_rw.value?.renounceOwnership()
  }

  const transfer = async (address: string, amount: number) => {
    await _instance_rw.value?.transfer(
      address,
      new BN(amount).toFraction(decimals.value).toString(),
    )
  }

  const transferFrom = async (from: string, to: string, amount: number) => {
    await _instance_rw.value?.transferFrom(
      from,
      to,
      new BN(amount).toFraction(decimals.value).toString(),
    )
  }

  const getAllowance = async (owner: string, spender: string) => {
    const _allowance = await _instance.value?.allowance(owner, spender)
    if (_allowance) {
      allowance.value = _allowance.toString()
    }
  }

  const getBalanceOf = async (address: string) => {
    const _balance = await _instance.value?.balanceOf(address)

    return _balance ? _balance.toString() : ''
  }

  const getDecimals = async () => {
    if (_instance.value?.decimals) {
      decimals.value = await _instance.value?.decimals()
    }
  }

  const getName = async () => {
    if (_instance.value?.name) {
      name.value = await _instance.value?.name()
    }
  }

  const getOwner = async () => {
    if (_instance.value?.owner) {
      owner.value = await _instance.value?.owner()
    }
  }

  const getSymbol = async () => {
    if (_instance.value?.symbol) {
      symbol.value = await _instance.value?.symbol()
    }
  }

  const getTotalSupply = async () => {
    const _totalSupply = await _instance.value?.totalSupply()

    if (_totalSupply) {
      totalSupply.value = _totalSupply.toString()
    }
  }

  const approveSpend = async (
    owner: string,
    amount: string,
    spender: string,
  ) => {
    try {
      await Promise.all([getDecimals(), getAllowance(owner, spender)])
      const amountInWei = new BN(amount).toFraction(decimals.value)

      if (new BN(allowance.value).compare(amountInWei) === -1) {
        const tx = await approve(spender, BN.MAX_UINT256.toString())
        await tx?.wait()
      }
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    allowance,
    decimals,
    name,
    owner,
    symbol,
    totalSupply,
    balance,

    init,
    loadDetails,

    useErc20,
    approve,
    decreaseAllowance,
    increaseAllowance,
    mint,
    renounceOwnership,
    transfer,
    transferFrom,

    getAllowance,
    getBalanceOf,
    getDecimals,
    getName,
    getOwner,
    getSymbol,
    getTotalSupply,
    approveSpend,
  }
}
