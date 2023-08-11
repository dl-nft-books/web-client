import getSymbolFromCurrency from 'currency-symbol-map'
import { BN, BnLike } from '@distributedlab/tools'
import { TokenPrice } from '@/types'

export function cropAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-5)}`
}

function _formatMoney(formattedAmount: string, currency = '') {
  const symbol = getSymbolFromCurrency(currency)
  return symbol
    ? `${symbol}${formattedAmount}`
    : `${formattedAmount} ${currency}`
}

export function formatFiatAssetFromWei(amount: BnLike, currency = '') {
  const formattedAmount = BN.fromBigInt(amount)
    .format({ decimals: 2 })
    .toString()

  return _formatMoney(formattedAmount, currency)
}

export function formatAssetFromWei(
  amount: BnLike,
  decimals: number,
  currency = '',
) {
  const formattedAmount = BN.fromBigInt(amount).format({ decimals }).toString()

  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}

export const calcFormattedTokenAmount = (
  tokenPrice: TokenPrice | null,
  bookPrice: string,
  discount = 0,
) => {
  if (!tokenPrice) return ''

  const formatted = BN.fromBigInt(bookPrice).div(
    BN.fromRaw(tokenPrice.price, tokenPrice.token.decimals),
  )

  return discount
    ? formatted.mul(BN.fromRaw(1 - discount)).toString()
    : formatted.toString()
}
