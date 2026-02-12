import { ErrorCode, HttpExceptions } from "./root.js";

export class UnAuthorized extends HttpExceptions{
  constructor(message:string, errorCode: ErrorCode, errors:any ){
    super(message, errorCode, 403, errors)
  }
}