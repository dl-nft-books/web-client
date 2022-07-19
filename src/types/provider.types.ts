import { useProvider } from '@/composables'
import { ComputedRef, Ref } from 'vue'
import { PROVIDERS } from '@/enums'
import { ethers } from 'ethers'
import { Deferrable } from '@ethersproject/properties'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { EthereumProvider } from '@/types/ethereum.types'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'

/**
 * Non defined provider from browser
 */
export type ProviderInstance = EthereumProvider | unknown

/**
 * provider, which we've designated, it has a name and instance
 */
export type DesignatedProvider = {
  name: PROVIDERS
  instance: ProviderInstance
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | unknown

export type TransactionResponse =
  | ethers.providers.TransactionResponse
  | TransactionSignature
  | unknown

/**
 * composable object of designated provider,
 * which we can use to solve user needs
 */
export interface ProviderWrapper {
  chainId: Ref<string | number>
  selectedAddress: Ref<string>
  isConnected: ComputedRef<boolean>

  init: () => Promise<void>
  connect: () => Promise<void>
  switchChain: (chainId: string | number) => Promise<void>
  addChain: (
    chainId: string | number,
    chainName: string,
    chainRpcUrl: string,
  ) => Promise<void>
  signAndSendTransaction: (
    txRequestBody: TxRequestBody,
  ) => Promise<TransactionResponse>
}

export type UseProvider = ReturnType<typeof useProvider>
