import type { NextFunction, Request, Response } from "express";
import {prisma} from "../../lib/prisma.js"
import jwt from "jsonwebtoken"
import { UnAuthorized } from "../exceptions/unauthorize.js";
import { ErrorCode } from "../exceptions/root.js";
import { JWT_SECRET } from "../secrets.js";

export const authenticateUser = async(req: Request, res: Response, next: NextFunction) =>{
  const token = req.headers.authorization

  if (!token){
    throw new UnAuthorized('UnAuthorized', ErrorCode.UNAUTHORIZED, null);
  }

  try {
    const userId: any = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findFirst({
      where: {
        id: userId.user
      }
    })
    if (!user){
      throw new UnAuthorized('UnAuthorized', ErrorCode.UNAUTHORIZED, null);
    }

    req.user = user

    next()



  } catch (error) {
    throw new UnAuthorized('UnAuthorized', ErrorCode.UNAUTHORIZED, error);
  }
}