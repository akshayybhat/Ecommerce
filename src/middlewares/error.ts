import type { NextFunction, Request, Response } from "express";
import type { HttpExceptions } from "../exceptions/root.js";

export const errorException = (error:HttpExceptions, req: Request, res: Response, next:NextFunction)=>{
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors
  })
}