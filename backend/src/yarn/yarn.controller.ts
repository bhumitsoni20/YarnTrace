import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { YarnService } from './yarn.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Yarn Catalog')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('yarn')
export class YarnController {
  constructor(private readonly yarnService: YarnService) {}

  @Get()
  @RequirePermission('view_inventory')
  @ApiOperation({ summary: 'Get yarn catalog list' })
  async findAll() {
    const data = await this.yarnService.findAll();
    return {
      message: 'Yarn catalog retrieved successfully',
      data,
    };
  }
}
