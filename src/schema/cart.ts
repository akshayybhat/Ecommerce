import {number, string, z} from 'zod'

export const createCartSchema = z.object({
  productId: string(),
  quantity: number()
})