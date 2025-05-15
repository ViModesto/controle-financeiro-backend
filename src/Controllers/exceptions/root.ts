 export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: any;

  constructor(message: string, erroCode: any, statusCode: number, error: any) {
    super(message);

    this.message = message;
    this.errorCode = erroCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
}
