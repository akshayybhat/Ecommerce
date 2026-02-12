import type { NextFunction, Request, Response } from "express";
import { createProductSchema } from "../schema/product.js";
import { UnProcessedEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { prisma } from "../../lib/prisma.js";

export const createProduct = async(req:Request, res:Response, next:NextFunction) =>{
  try {
    const productDetails = createProductSchema.safeParse(req.body);

    if (!productDetails.success){
      throw new UnProcessedEntity('Bad Request, could not be processed', ErrorCode.UNPROCESSED_ENTITY, 400, null)
    }
    const {name, description, price} = productDetails?.data
    const tags = productDetails?.data.tags.join(',');

    const product = await prisma.product.create({
      data: {
        name, description, price, tags
      }
    })

    res.json(product)

  } catch (error) {
    throw new UnProcessedEntity('Could not be processed', ErrorCode.UNPROCESSED_ENTITY, 400, error)
  }
}