import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PartiesService } from './parties.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Parties & Suppliers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Get()
  @RequirePermission('manage_parties')
  @ApiOperation({ summary: 'Get all parties (Suppliers, Customers, Dyeing Mills)' })
  async findAll() {
    const data = await this.partiesService.findAll();
    return {
      message: 'Parties retrieved successfully',
      data,
    };
  }
}
