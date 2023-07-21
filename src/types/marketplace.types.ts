export type BuyParams = {
  paymentDetails: PaymentDetails
  tokenContract: string
  recipient: string
  tokenData: TokenMintData
}

export type Signature = {
  r: string
  s: string
  v: number
  endSigTimestamp: number
}

type PaymentDetails = {
  paymentTokenAddress: string
  paymentTokenPrice: string
  discount: string
  nftTokenId: string
}

type TokenMintData = {
  tokenId: string
  tokenURI: string
}
