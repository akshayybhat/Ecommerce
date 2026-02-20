import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import type { Params } from "../types/product.js";

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