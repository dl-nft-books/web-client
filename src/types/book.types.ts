export type Book = {
  id: number | string
  title: string
  price: {
    amount: number
    assetCode: string
  }
  coverUrl: string
  description?: string
}
