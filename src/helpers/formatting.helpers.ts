import getSymbolFromCurrency from 'currency-symbol-map'
import { BN, BnLike } from '@/utils/math.util'
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

export function formatFiatAsset(amount: BnLike, currency = '') {
  const formattedAmount = new BN(amount).format({
    decimals: 2,
  })

  return _formatMoney(formattedAmount, currency)
}

export function formatFiatAssetFromWei(amount: BnLike, currency = '') {
  const formattedAmount = new BN(amount).fromWei().format({
    decimals: 2,
  })

  return _formatMoney(formattedAmount, currency)
}

export function formatAssetFromWei(
  amount: BnLike,
  decimals: number,
  currency = '',
) {
  const formattedAmount = new BN(amount).fromWei().format({ decimals })

  return currency ? `${formattedAmount} ${currency}` : formattedAmount
}

export function formatNumber(amount: BnLike) {
  const formattedAmount = new BN(amount).format({
    decimals: 2,
  })

  return formattedAmount
}

export const calcFormattedTokenAmount = (
  tokenPrice: TokenPrice | null,
  bookPrice: string,
  discount = 0,
) => {
  if (!tokenPrice) return ''

  const formatted = new BN(bookPrice, {
    decimals: tokenPrice.token.decimals,
  })
    .fromFraction(tokenPrice.token.decimals)
    .div(tokenPrice.price)

  return discount
    ? formatted.mul(1 - discount).toString()
    : formatted.toString()
}
