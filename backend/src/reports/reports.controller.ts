import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ReportFilterDto } from './dto/report-filter.dto';
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

  @Get('export/excel')
  @RequirePermission('view_reports')
  @ApiOperation({ summary: 'Export complete 12-sheet Master Excel report' })
  async exportMasterExcel(
    @Query() filter: ReportFilterDto,
    @Res() res: Response,
  ) {
    const result = await this.reportsService.exportMasterExcel(filter);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.filename}"`,
    );
    res.send(result.buffer);
  }

  @Get('export/weekly-excel')
  @RequirePermission('view_reports')
  @ApiOperation({ summary: 'Export operational Weekly Excel report' })
  async exportWeeklyExcel(
    @Query() filter: ReportFilterDto,
    @Res() res: Response,
  ) {
    const result = await this.reportsService.exportWeeklyExcel(filter);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.filename}"`,
    );
    res.send(result.buffer);
  }
}
