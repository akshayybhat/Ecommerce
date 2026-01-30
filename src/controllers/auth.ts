import { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma.js";
import {hashSync, compareSync} from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets.js";

export const signup = async(req: Request, res:Response) =>{
  const {email, password, name} = req.body
  
  let user = await prisma.user.findFirst({
    where: {
      email: email
    }
  }) 

  if (user){
    throw new Error("user already exists!")
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
}

export const login = async(req: Request, res:Response) =>{
  const {email, password} = req.body
  
  let user = await prisma.user.findFirst({
    where: {
      email: email
    }
  }) 
  // user doesnt exist
  if (!user){
    throw new Error("user does not exists!")
  }
  // if password dint match
  if (!compareSync(password, user.password)){
    throw new Error("password is incorrect")
  }
  
  const token = jwt.sign({user:user.id}, JWT_SECRET)
  
  
  res.json({user, token});

}