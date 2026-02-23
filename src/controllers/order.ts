import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import type { Params } from "../types/product.js";
import { NotFound } from "../exceptions/notFound.js";
import { ErrorCode } from "../exceptions/root.js";

export const createOrder = async(req: Request<Params>, res: Response) =>{
  
  return await prisma.$transaction(async (tx)=>{

    // get all items from the cart
    const allCartItems = await tx.cartItem.findMany({
      where:{
        userId: req.user.id
      },
      include: {
        product: true
      }
    })

    if (allCartItems.length == 0){
      return res.status(400).json({message: "Cart is empty"})
    }
    // get total net amount
    const price = allCartItems.reduce((prev,item)=>{
      return prev + item.quantity * Number(item.product.price)
    },0)
    // get default shipping address
    const address = await tx.address.findFirst({
      where:{
        id: req.user?.defaultShippingAddressID
      }
    })

    const orderAddress = `${address?.lineOne} ${address?.lineTwo} ${address?.city} ${address?.country}-${address?.pincode}}`

    // create a new order - along with order product table
    const newOrder = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: orderAddress,
        orderProduct: {
          create: allCartItems.map((item)=>{
            return {
              productId: item.productId,
              quantity: item.quantity
            }
          })
        },
        orderEvent:{
          create: {
            status: "PENDING"
          }
        }
      }
    })
    
    // delete cart once order is created

    await tx.cartItem.deleteMany({
      where:{
        userId: req.user.id
      }
    })
    
    return res.json(newOrder)


  })
}

export const getAllOrder = async(req: Request, res: Response) =>{
  const orders = await prisma.order.findMany({
    where: {
      userId: req.user.id
    }
  })
  res.json(orders)
}


export const getOrderbyId = async(req:Request, res: Response, next: NextFunction)=>{

  try {
    
    const order  = await prisma.order.findFirstOrThrow({
      where: {
        id: String(req.params.id),
        userId: req.user.id
      },
      include:{
        orderProduct: true,
        orderEvent: true
      }
    })
    
    res.json(order)
  } catch (error) {
    return next(new NotFound("Order ID not found.", ErrorCode.ORDER_ID_NOT_FOUND, error))
  }


}

export const cancelOrder = async(req:Request, res:Response, next: NextFunction)=>{

  await prisma.$transaction(async(tx)=>{

    const cancelledOrder = await tx.order.update({
      where: {
        id: String(req.params.id),
        userId: req.user.id
        
      },
      data: {
        status: "CANCELLED"
      }
    })

    // update orderEvent table
    const orderCancel = await tx.orderEvent.create({
      data: {
        orderId: cancelledOrder.id,
        status: "CANCELLED"
      }
    })

    res.json({cancelled: true, orderCancel})
  })
  

}


// fetches all the orders for admin 
export const fetchAllOrders = async(req: Request, res: Response) =>{
  
  const status = req.query.status;
  let whereClause  = {}
  if (status){
    whereClause = {
      status
    }
  }
  
  // whereClause is an optional
  const allOrders = await prisma.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
    take: 5
  })
  res.json(allOrders)
}

// change the status of a order (admins only)
export const changeOrderStatus = async(req:Request, res:Response, next: NextFunction) =>{

  await prisma.$transaction(async(tx)=>{
    try {
      const order = await tx.order.update({
        where: {
          id: String(req.params.id)
        },
        data: {
          status: req.body.status
        }
      })

      await tx.orderEvent.create({
        data:{
          orderId: order.id,
          status: req.body.status
        }
      })

      res.json(order)
    } catch (error) {
      return next(new NotFound("order not found", ErrorCode.ORDER_ID_NOT_FOUND, error))
    }

  })
  
}

// get orders of a user (admin)
export const getOrderUser = async(req:Request, res:Response, next: NextFunction) =>{

  let whereClause = {}
  let status = req.query.status
  if (status){
    whereClause = {
      status
    }
  }

  try {
    const userOrder = await prisma.order.findMany({
      where:{
        ... whereClause,
        userId: String(req.params.id)
      }
    })

    res.json(userOrder)
  } catch (error) {
    return next (new NotFound("user not found.", ErrorCode.USER_NOT_FOUND, error))
  }
}