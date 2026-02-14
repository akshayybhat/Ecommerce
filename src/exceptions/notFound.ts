import { ErrorCode, HttpExceptions } from "./root.js";

export class NotFound extends HttpExceptions{
  constructor(message: string, errorCode:ErrorCode, errors:any){
    super(message, errorCode, 404, errors)
  }
}