import { computed, ref } from 'vue'
import { Erc20__factory, EthProviderRpcError } from '@/types'
import { handleEthError, sleep } from '@/helpers'
import { BigNumber } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'

export const useErc20 = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        Erc20__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  const contractInterface = Erc20__factory.createInterface()

  const allowance = ref<BigNumber>()
  const decimals = ref(0)
  const name = ref('')
  const owner = ref('')
  const symbol = ref('')
  const totalSupply = ref<BigNumber>()
  const balance = ref<BigNumber>()

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const loadDetails = async () => {
    try {
      const [_decimals, _name, _owner, _symbol, _totalSupply, _balance] =
        await Promise.all([
          getDecimals(),
          getName(),
          getOwner(),
          getSymbol(),
          getTotalSupply(),
          getBalanceOf(provider.value.selectedAddress!),
        ])

      decimals.value = _decimals!
      name.value = _name!
      owner.value = _owner!
      symbol.value = _symbol!
      totalSupply.value = _totalSupply!
      balance.value = _balance!
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const approve = async (spender: string, amount: number | string) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('approve', [
        spender,
        amount,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const decreaseAllowance = async (
    spender: string,
    subtractedValue: number,
  ) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('decreaseAllowance', [
        spender,
        subtractedValue,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const increaseAllowance = async (spender: string, addedValue: number) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('increaseAllowance', [
        spender,
        addedValue,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const mint = async (to: string, amount: number) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('mint', [to, amount])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const renounceOwnership = async () => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('renounceOwnership')

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const transfer = async (address: string, amount: number) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('transfer', [
        address,
        amount,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: address,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const transferFrom = async (from: string, to: string, amount: number) => {
    if (!provider.value) return

    try {
      const data = contractInterface.encodeFunctionData('transferFrom', [
        from,
        to,
        amount,
      ])

      const receipt = await provider.value.signAndSendTx({
        to: contractAddress.value,
        data,
      })

      await sleep(1000)
      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getAllowance = async (owner: string, spender: string) => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.allowance(owner, spender)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getBalanceOf = async (address: string) => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.balanceOf(address)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getDecimals = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.decimals()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getName = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.name()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getOwner = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.owner()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getSymbol = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.symbol()
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getTotalSupply = async () => {
    if (!contractInstance.value) return

    try {
      return contractInstance.value?.totalSupply()
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

    init,
  }
}
