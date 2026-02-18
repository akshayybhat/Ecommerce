import type { NextFunction, Request, Response } from "express";
import { createCartSchema } from "../schema/cart.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import { prisma } from "../../lib/prisma.js";
import { NotFound } from "../exceptions/notFound.js";
import type { Params } from "../types/product.js";
import { UnAuthorized } from "../exceptions/unauthorize.js";


export const createCartItem = async(req: Request, res: Response, next:NextFunction) =>{
  const validatedData = createCartSchema.safeParse(req.body);

  if (!validatedData.success){
    return next(new BadRequestException("Bad Request", ErrorCode.UNPROCESSED_ENTITY))
  }

  // if product already exist in cart increase quantity

  const isProductExist = await prisma.cartItem.findFirst({
    where:{
      userId: req.user.id,
      productId: validatedData.data.productId
    }
  })

  if (isProductExist){
    const cartAdded = await prisma.cartItem.update({
      where: {
        id: isProductExist.id,
        userId: req.user.id
      },
      data: {
        ... validatedData.data,
        quantity: isProductExist.quantity+validatedData.data.quantity
      }
    })

    return res.json(cartAdded)
  }
  

  // check if product exist in product table
  try {
    await prisma.product.findFirstOrThrow({
      where:{
        id: validatedData.data.productId
      }
    })
  } catch (error) {
    return next(new NotFound("product ID doesn not exist.", ErrorCode.PRODUCT_NOT_FOUND, error))
  }
  

  const cartAdded = await prisma.cartItem.create({
    data:{
      userId: req.user.id,
      productId: validatedData.data.productId,
      quantity: req.body.quantity
    }
  })

  res.json(cartAdded)


}

export const fetchAllCartItem = async(req: Request, res: Response, next:NextFunction) =>{
  
  try {
    const allCartItems = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id
      },
      include:{
        product: true
      }
    })
    res.json(allCartItems)
  } catch (error) {
    return next(new NotFound("Cart is empty", ErrorCode.CART_NOT_FOUND, error))
  }

}

// delete cart by id
export const deleteCartItem = async(req: Request<Params>, res: Response, next:NextFunction) =>{
  
  try {
    
    await prisma.cartItem.delete({
      where:{
        id: req.params.id,
        userId: req.user.id
      }
    })
    res.json({success: true})
  } catch (error) {
    return next(new UnAuthorized("you can only delete, cart created by you" ,ErrorCode.UNAUTHORIZED, error))
  }

}
 

