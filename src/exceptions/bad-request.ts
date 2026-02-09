import { ErrorCode, HttpExceptions } from "./root.js";

export class BadRequestException extends HttpExceptions {
  constructor(message: string, errorCode:ErrorCode){
    super(message, errorCode, 400, null)
  }
}