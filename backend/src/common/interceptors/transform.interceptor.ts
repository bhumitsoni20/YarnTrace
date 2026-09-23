import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardApiResponse<T>> {
    return next.handle().pipe(
      map((res) => {
        // If the handler already returned a formatted structure with success flag, pass it through
        if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
          return res;
        }
        
        return {
          success: true,
          message: res?.message || 'Request successful',
          data: res?.data !== undefined ? res.data : res,
        };
      }),
    );
  }
}
