export class HttpExceptions extends Error{

  message: string;
  errorCode: ErrorCode;
  statusCode:number;
  errors: any;

  constructor (message:string, errorCode:ErrorCode, statusCode:number, errors:any){
    super(message)
    this.message = message
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.errors = errors
  }

}
export enum ErrorCode{
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNPROCESSED_ENTITY = 2001,
  UNAUTHORIZED = 4001,
  PRODUCT_NOT_FOUND = 4002,
  ADDRESS_NOT_FOUND=4003
}