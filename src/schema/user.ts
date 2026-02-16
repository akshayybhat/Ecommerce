import {string, z} from "zod"

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6)
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export const addressSchema = z.object({
  lineOne: string(),
  lineTwo: string(),
  city: string(),
  country: string(),
  pincode: string().length(6)
})

export const updateUserScehma = z.object({
  name: string().optional(),
  defaultShippingAddressID: string().optional(),
  defaultBillingAddressID: string().optional()
})