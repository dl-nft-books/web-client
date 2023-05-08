import { useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import { Voucher__factory, EthProviderRpcError } from '@/types'
import { handleEthError } from '@/helpers'
import { DateUtil } from '@distributedlab/utils'
import { ethers } from 'ethers'
import { Signature } from '@/types'

const CONTRACT_VERSION = '1'
const CONTRACT_NAME = 'Voucher'
const SIG_END_OFFSET = 5 // minutes

export const useVoucher = (address?: string) => {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const provider = computed(() => web3ProvidersStore.provider)

  const contractAddress = ref(address || '')

  const contractInstance = computed(
    () =>
      (!!provider.value &&
        !!provider.value.currentProvider &&
        !!contractAddress.value &&
        Voucher__factory.connect(
          contractAddress.value,
          provider.value.currentProvider,
        )) ||
      undefined,
  )

  const init = (address: string) => {
    if (!address) return

    contractAddress.value = address
  }

  const getName = async () => {
    if (!contractInstance.value) return

    try {
      const data = await contractInstance.value.name()

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getNonce = async (ownerAddress: string) => {
    if (!contractInstance.value) return

    try {
      const data = await contractInstance.value.nonces(ownerAddress)

      return data
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const getPermitSignature = async (
    ownerAddress: string,
    spender: string,
    amount: string,
  ): Promise<Signature | undefined> => {
    if (!contractInstance.value) return

    try {
      const [nonce, name, version, chainId] = await Promise.all([
        getNonce(ownerAddress),
        CONTRACT_NAME,
        CONTRACT_VERSION,
        provider.value.chainId,
      ])

      const endSigTimestamp = DateUtil.now()
        .add(SIG_END_OFFSET, 'minutes')
        .unix()

      const signedData = await provider.value.signTypedData(
        {
          name,
          version,
          chainId,
          verifyingContract: contractAddress.value,
        },
        {
          Permit: [
            {
              name: 'owner',
              type: 'address',
            },
            {
              name: 'spender',
              type: 'address',
            },
            {
              name: 'value',
              type: 'uint256',
            },
            {
              name: 'nonce',
              type: 'uint256',
            },
            {
              name: 'deadline',
              type: 'uint256',
            },
          ],
        },
        {
          owner: ownerAddress,
          spender,
          value: amount,
          nonce,
          deadline: endSigTimestamp,
        },
      )

      if (!signedData) throw new Error('Failed to sign')

      const { r, s, v } = ethers.utils.splitSignature(signedData)

      return {
        r,
        s,
        v,
        endSigTimestamp,
      }
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    init,
    getNonce,
    getName,
    getPermitSignature,
  }
}
