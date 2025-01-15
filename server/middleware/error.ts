import { Request, Response, NextFunction } from 'express';

export class APIError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const errorHandler = (
  err: Error | APIError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'Internal server error',
    code: 'SERVER_001',
  });
};
