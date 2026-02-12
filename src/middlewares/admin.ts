import type { NextFunction, Request, Response } from "express";
import { UnAuthorized } from "../exceptions/unauthorize.js";
import { ErrorCode } from "../exceptions/root.js";

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) =>{
  if (!req.user){
    throw  new UnAuthorized('UnAuthorized', ErrorCode.UNAUTHORIZED, null)
  }

  if (req.user.role === "USER"){
    throw new UnAuthorized('UnAuthorized', ErrorCode.UNAUTHORIZED, null)
  }else{
    next()
  }

}