import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { addressSchema } from "../schema/user.js";
import { UnProcessedEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import type { Params } from "../types/product.js";

export const addAddress = async(req: Request, res: Response, next: NextFunction) =>{
  
  try {
    const payload = addressSchema.safeParse(req.body);

    if (!payload.success){
      throw new UnProcessedEntity('Could not process', ErrorCode.UNPROCESSED_ENTITY, 400, payload.error)
    }
    const address = await prisma.address.create({
      data: {
        ... payload.data,
        userId: req.user.id
      }
    })

    res.json(address);
  } catch (error) {
    throw new UnProcessedEntity('Could not process.', ErrorCode.UNPROCESSED_ENTITY, 400, error)
  }
}
// deletes the address by ID
export const deleteAddress = async(req: Request<Params>, res: Response, next: NextFunction) =>{
  
  try {
    const idToDelete = req.params.id!

    await prisma.address.delete({
      where: {
        id: idToDelete
      }
    })

    res.json({success: true})
    
  } catch (error) {
    throw new UnProcessedEntity('Could not find the Address ID.', ErrorCode.ADDRESS_NOT_FOUND, 400, error)
  }
}
// fetch all Address of a user
export const fetchAllAddress = async(req: Request, res: Response, next: NextFunction) =>{
  
  
  const addressList = await prisma.address.findMany({
    where: {
      userId: req.user.id
    }
  })

  res.json(addressList)
    
  
}
