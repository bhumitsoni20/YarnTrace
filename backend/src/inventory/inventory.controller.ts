import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Inventory')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('summary')
  @RequirePermission('view_inventory')
  @ApiOperation({ summary: 'Get aggregated real-time stock balances across locations' })
  async getStockSummary() {
    const data = await this.inventoryService.getStockSummary();
    return {
      message: 'Stock summary retrieved successfully',
      data,
    };
  }

  @Get('locations')
  @RequirePermission('view_inventory')
  @ApiOperation({ summary: 'Get all active warehouse/silo storage locations' })
  async getLocations() {
    const data = await this.inventoryService.getLocations();
    return {
      message: 'Stock locations retrieved successfully',
      data,
    };
  }
}
