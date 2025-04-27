export interface Book {
  _id?: string
  title: string
  author: string
  publicationDate: Date
  price: number
  pageCount: number
  genre: string
  createdAt?: Date
  updatedAt?: Date
}
