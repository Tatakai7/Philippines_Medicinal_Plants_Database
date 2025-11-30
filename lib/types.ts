export interface Plant {
  _id: string
  name: string
  scientificName: string
  tagalogName: string
  family: string
  genus: string
  category: string[]
  uses: string[]
  description: string
  activeCompounds: string[]
  preparation: string[]
  precautions: string[]
  image: string
  createdAt?: Date
  updatedAt?: Date
}

export interface SearchParams {
  q: string
  filter: "all" | "name" | "uses"
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}
