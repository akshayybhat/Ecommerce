import type { NextFunction, Request, Response } from "express";
import { createProductSchema, updateProductSchema } from "../schema/product.js";
import { UnProcessedEntity } from "../exceptions/validation.js";
import { ErrorCode } from "../exceptions/root.js";
import { prisma } from "../../lib/prisma.js";
import { NotFound } from "../exceptions/notFound.js";
import type { Params } from "../types/product.js";

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

// update product controller
export const updateProduct = async(req:Request<Params>, res:Response, next:NextFunction) =>{


  try {

    const payload = updateProductSchema.safeParse(req.body)
    if (!payload.success){
      throw new UnProcessedEntity('Bad Request, could not be processed', ErrorCode.UNPROCESSED_ENTITY, 400, null)
    }

    const idToUpdate  = req.params.id
    if (!idToUpdate){
      throw new NotFound('ID could not be found', ErrorCode.UNPROCESSED_ENTITY, null)
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: idToUpdate
      },
      data: payload.data
    })
    res.json(updatedProduct)

  } catch (error) {
    throw new NotFound('Product could not be found', ErrorCode.PRODUCT_NOT_FOUND, error)
  }
}

// deletes the passed product id
export const deleteProduct = async(req:Request<Params>, res:Response, next:NextFunction) =>{


  try {

    const idToDelete = req.params.id

    if (!idToDelete){
      throw new UnProcessedEntity('Bad Request, product ID could not be processed', ErrorCode.UNPROCESSED_ENTITY, 400, null)
    }

    const deleteProduct = await prisma.product.delete({
      where:{
        id: idToDelete
      }
    })
    res.json(deleteProduct)

  } catch (error) {
    throw new NotFound('Product could not be found', ErrorCode.PRODUCT_NOT_FOUND, error)
  }
}

// fetches the product by given Id passed in params
export const getProductByID = async(req:Request<Params>, res:Response, next:NextFunction) =>{


  try {

    const idToFetch = req.params.id

    const product = await prisma.product.findFirstOrThrow({
      where:{
        id: idToFetch
      }
    })
    res.json(product)

  } catch (error) {
    throw new NotFound('Product could not be found', ErrorCode.PRODUCT_NOT_FOUND, error)
  }
}

// fetches all the products with pagination
export const fetchAllProducts = async(req:Request, res:Response, next:NextFunction) =>{


  try {

    const totalCount = await prisma.product.count()

    const allProducts = await prisma.product.findMany({
      skip: +req.query.skip! || 0,
      take: 5
    })

    res.json({allProducts, totalCount})

  } catch (error) {
    return next( new UnProcessedEntity('Something went wrong', ErrorCode.UNPROCESSED_ENTITY, 500, error))
  }
}


// full text search - (/product?q=searchproducts)

export const fullTextSearchProducts = async(req:Request, res:Response) =>{

  
  const results = await prisma.product.findMany({
    where: {
      name: {
        search: String(req.query.q)
      },
      description: {
        search: String(req.query.q)
      },
      tags: {
        search: String(req.query.q)
      }
    },
    skip: Number(req.query.skip) || 0,
    take: 5
  })
  
  res.json(results)

}