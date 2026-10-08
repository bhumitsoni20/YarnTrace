import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Audit & System Governance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermission('view_audit_logs', 'manage_users')
  @ApiOperation({ summary: 'Get paginated immutable system activity audit logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'module', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('module') module?: string,
    @Query('action') action?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.auditService.getLogs({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 25,
      module,
      action,
      search,
    });
    return {
      message: 'Audit logs retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }
}
