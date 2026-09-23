import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Production')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get('teams')
  @RequirePermission('manage_production')
  @ApiOperation({ summary: 'Get all active production teams and departments' })
  async getTeams() {
    const data = await this.productionService.getTeams();
    return {
      message: 'Production teams retrieved successfully',
      data,
    };
  }

  @Get('orders')
  @RequirePermission('manage_production')
  @ApiOperation({ summary: 'Get active production work orders' })
  async getOrders() {
    const data = await this.productionService.getOrders();
    return {
      message: 'Production orders retrieved successfully',
      data,
    };
  }
}
