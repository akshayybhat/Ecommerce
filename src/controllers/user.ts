import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { addressSchema, updateUserScehma } from "../schema/user.js";
import { UnProcessedEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import type { Params } from "../types/product.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { UnAuthorized } from "../exceptions/unauthorize.js";

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

//update user

export const updateUser = async(req: Request, res: Response, next: NextFunction) =>{

  const payload = updateUserScehma.safeParse(req.body);

  if (!payload.success){
    throw new BadRequestException("Bad Request", ErrorCode.UNPROCESSED_ENTITY)
  }
  
  // get the address from address table, based on the shipping and billing id passed
  try {

    if (payload.data.defaultShippingAddressID){
      const shippingAddress = await prisma.address.findFirstOrThrow({
        where:{
          id: payload.data.defaultShippingAddressID
        }
      })

      if (shippingAddress.userId != req.user.id){
        return next(new UnAuthorized('You can not default other user addresses', ErrorCode.UNAUTHORIZED, null))
      }
    }

    

    if (payload.data.defaultBillingAddressID){
      const billingAddress = await prisma.address.findFirstOrThrow({
        where:{
          id: payload.data.defaultBillingAddressID
        }
      })

      if (billingAddress.userId != req.user.id){
        return next(new UnAuthorized('You can not default other user addresses', ErrorCode.UNAUTHORIZED, null))
      }
    }


  } catch (error) {
    return next( new UnProcessedEntity('Could not find the Address', ErrorCode.ADDRESS_NOT_FOUND, 404, error))
  }
  

  // update user to user table
  try{
    const userUpdated = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: payload.data
    })

    res.json(userUpdated)
  }catch(error){
    return next(new UnProcessedEntity("could not update user", ErrorCode.UNPROCESSED_ENTITY, 500, error))
  }
  
}