import { Ref, computed, ref } from 'vue'
import { ethers } from 'ethers'
import { time } from '@distributedlab/tools'

import {
  Voucher__factory,
  EthProviderRpcError,
  UnwrappedProvider,
} from '@/types'
import { handleEthError } from '@/helpers'
import { config } from '@/config'
import { Signature } from '@/types'

const CONTRACT_VERSION = '1'
const CONTRACT_NAME = 'Voucher'
const SIG_END_OFFSET = Number(config.SIGNATURE_EXPIRATION_TIME) // hours

export const useVoucher = (
  provider: Ref<UnwrappedProvider>,
  address?: string,
) => {
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

      const endSigTimestamp = time().add(SIG_END_OFFSET, 'hours').timestamp

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
