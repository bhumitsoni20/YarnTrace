import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Reports & Analytics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('kpi-summary')
  @RequirePermission('view_reports')
  @ApiOperation({ summary: 'Get enterprise KPI overview metrics' })
  async getKpiSummary() {
    const data = await this.reportsService.getKpiSummary();
    return {
      message: 'KPI summary retrieved successfully',
      data,
    };
  }
}
