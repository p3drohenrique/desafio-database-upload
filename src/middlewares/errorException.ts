import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

export default function errorException(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response<any> {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
}
