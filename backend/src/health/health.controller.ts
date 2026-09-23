import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'API Health Check' })
  @ApiResponse({
    status: 200,
    description: 'System health status',
    schema: {
      example: {
        status: 'ok',
        service: 'yarntrace-api',
      },
    },
  })
  check() {
    return {
      status: 'ok',
      service: 'yarntrace-api',
    };
  }
}
