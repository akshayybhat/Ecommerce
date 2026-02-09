import { ErrorCode, HttpExceptions } from "./root.js";

export class UnProcessedEntity extends HttpExceptions{
  constructor(message: string, errorCodes: ErrorCode, statusCode: number, errors: any){
    super(message, errorCodes, statusCode, errors);
  }
}