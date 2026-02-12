import { type NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma.js";
import {hashSync, compareSync} from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import { loginSchema, signUpSchema } from "../schema/user.js";
import { UnProcessedEntity } from "../exceptions/validation.js";

export const signup = async(req: Request, res:Response, next:NextFunction) =>{

  //zod validation
  try {
    const signUpDetails = signUpSchema.safeParse(req.body);
    //early return
    if (!signUpDetails.success){
      return next(new UnProcessedEntity('Invalid input', ErrorCode.UNPROCESSED_ENTITY, 400, signUpDetails.error))
    }
    const {email, password, name} = signUpDetails?.data;
    
    let user = await prisma.user.findFirst({
      where: {
        email: email
      } 
    }) 

    if (user){
      return next(new BadRequestException("user already exists!", ErrorCode.USER_ALREADY_EXISTS));
    }
    // since user does not exist creates a user
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashSync(password, 10)
      }
    })

    res.json(user);
  } catch (error) {
    return next(new UnProcessedEntity('Internal Server Error', ErrorCode.UNPROCESSED_ENTITY, 500, error))
  }
  
}

export const login = async(req: Request, res:Response, next:NextFunction) =>{

  try {
    const loginDetails = loginSchema.safeParse(req.body)
    if (!loginDetails.success){
      return next(new UnProcessedEntity('Invalid input', ErrorCode.UNPROCESSED_ENTITY, 400, loginDetails.error))
    }
    const {email, password} = loginDetails?.data
    
    let user = await prisma.user.findFirst({
      where: {
        email: email
      }
    }) 
    // user doesnt exist
    if (!user){
      return next(new BadRequestException("user does not exists!", ErrorCode.USER_NOT_FOUND))
    }
    // if password dint match
    if (!compareSync(password, user.password)){
      return next(new BadRequestException("password is incorrect", ErrorCode.INCORRECT_PASSWORD))
      
    }
    
    const token = jwt.sign({user:user.id}, JWT_SECRET)
    
    
    res.json({user, token});
  } catch (error) {
    return next(new UnProcessedEntity('Internal Server Error', ErrorCode.UNPROCESSED_ENTITY, 500, error))
  }
  

}
export const me = async(req: Request, res:Response) =>{
  res.json(req.user)


}