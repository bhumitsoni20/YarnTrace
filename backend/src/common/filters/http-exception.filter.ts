import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let errors: string[] = [];

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const respObj = exceptionResponse as Record<string, unknown>;
      if (Array.isArray(respObj.message)) {
        errors = respObj.message as string[];
        message = 'Validation failed';
      } else if (typeof respObj.message === 'string') {
        message = respObj.message;
      }
    }

    if (errors.length === 0) {
      errors = [message];
    }

    this.logger.warn(`[HTTP ${status}] ${message}`);

    response.status(status).json({
      success: false,
      message,
      errors,
    });
  }
}
