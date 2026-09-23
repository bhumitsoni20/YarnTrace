import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LotsService } from './lots.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Lots & Batches')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  @RequirePermission('view_inventory')
  @ApiOperation({ summary: 'Get all yarn lots' })
  async findAll() {
    const data = await this.lotsService.findAll();
    return {
      message: 'Lots retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @RequirePermission('view_inventory')
  @ApiOperation({ summary: 'Get full lot details with traceability links' })
  async findOne(@Param('id') id: string) {
    const data = await this.lotsService.findOne(id);
    return {
      message: 'Lot details retrieved successfully',
      data,
    };
  }
}
