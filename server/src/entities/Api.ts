import { StatusCodes } from 'http-status-codes';

export interface ApiErrorType {
  code: string;
  message: string;
  statusCode?: StatusCodes;
}

export class ApiError extends Error {
  public code: string;
  public errorMessage: string;
  public statusCode: StatusCodes;

  constructor(args: ApiErrorType) {
    super(args.message);

    this.code = args.code;
    this.errorMessage = args.message;
    this.statusCode = args.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
