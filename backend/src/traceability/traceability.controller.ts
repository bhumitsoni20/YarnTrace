import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TraceabilityService } from './traceability.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';
import { Response, Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    email?: string;
    role?: { code?: string };
    permissions?: string[];
  };
}

@ApiTags('Traceability Engine')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('traceability')
export class TraceabilityController {
  constructor(private readonly traceabilityService: TraceabilityService) {}

  // ---------------------------------------------------------------------------
  // 1. ACTIVE LOT SUGGESTIONS & SEARCH
  // ---------------------------------------------------------------------------
  @Get('lots/active')
  @RequirePermission('traceability.view', 'view_traceability', 'inventory.view', 'view_inventory')
  @ApiOperation({ summary: 'Get active lots from real database for quick suggestion pills' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getActiveLots(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 10;
    const data = await this.traceabilityService.getActiveLots(lim);
    return {
      message: 'Active lots retrieved successfully',
      data,
    };
  }

  @Get('lots/search')
  @RequirePermission('traceability.view', 'view_traceability', 'inventory.view', 'view_inventory')
  @ApiOperation({ summary: 'Search lots by lot number, count, supplier, yarn name with debounce' })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchLots(@Query('q') q?: string, @Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 10;
    const data = await this.traceabilityService.searchLots(q || '', lim);
    return {
      message: 'Lots search results retrieved',
      data,
    };
  }

  @Get('products/search')
  @RequirePermission('traceability.view', 'view_traceability', 'production.view', 'manage_production')
  @ApiOperation({ summary: 'Search finished products or work orders for backward trace' })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchProducts(@Query('q') q?: string, @Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 10;
    const data = await this.traceabilityService.searchProducts(q || '', lim);
    return {
      message: 'Products search results retrieved',
      data,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. FORWARD TRACEABILITY (LOT -> PRODUCTION -> PRODUCT -> PARTY)
  // ---------------------------------------------------------------------------
  @Get('forward/lot/:lotNumber')
  @RequirePermission('traceability.view', 'view_traceability')
  @ApiOperation({
    summary: 'Forward Traceability: Yarn Lot -> Floor Movements -> Allocations -> Consumption -> Output -> Dispatch',
  })
  async traceForward(@Param('lotNumber') lotNumber: string) {
    const data = await this.traceabilityService.traceForwardByLot(lotNumber);
    return {
      message: 'Forward traceability trail retrieved',
      data,
    };
  }

  // Backward compatibility route alias
  @Get('forward/:lotNumber')
  @RequirePermission('traceability.view', 'view_traceability')
  @ApiOperation({ summary: 'Forward Traceability (route alias)' })
  async traceForwardAlias(@Param('lotNumber') lotNumber: string) {
    const data = await this.traceabilityService.traceForwardByLot(lotNumber);
    return {
      message: 'Forward traceability trail retrieved',
      data,
    };
  }

  // ---------------------------------------------------------------------------
  // 3. BACKWARD TRACEABILITY (PRODUCT / WO -> CONSUMPTION -> RAW YARN LOT)
  // ---------------------------------------------------------------------------
  @Get('backward/product/:productCode')
  @RequirePermission('traceability.view', 'view_traceability')
  @ApiOperation({
    summary: 'Backward Traceability: Finished Product / Order -> Production Order -> Consumed Raw Yarn Lots',
  })
  async traceBackward(@Param('productCode') productCode: string) {
    const data = await this.traceabilityService.traceBackwardByProduct(productCode);
    return {
      message: 'Backward traceability trail retrieved',
      data,
    };
  }

  // Backward compatibility route alias
  @Get('backward/:productCode')
  @RequirePermission('traceability.view', 'view_traceability')
  @ApiOperation({ summary: 'Backward Traceability (route alias)' })
  async traceBackwardAlias(@Param('productCode') productCode: string) {
    const data = await this.traceabilityService.traceBackwardByProduct(productCode);
    return {
      message: 'Backward traceability trail retrieved',
      data,
    };
  }

  // ---------------------------------------------------------------------------
  // 4. TRACE EXPORT
  // ---------------------------------------------------------------------------
  @Get('export')
  @RequirePermission('traceability.export', 'traceability.view', 'view_traceability', 'view_reports')
  @ApiOperation({ summary: 'Export traceability genealogy and reconciliation to CSV' })
  @ApiQuery({ name: 'type', enum: ['forward', 'backward'] })
  @ApiQuery({ name: 'identifier', type: String })
  async exportTrace(
    @Query('type') type: 'forward' | 'backward',
    @Query('identifier') identifier: string,
    @Res() res: Response,
  ) {
    const exportResult = await this.traceabilityService.exportTraceCsv(type, identifier);
    res.setHeader('Content-Type', exportResult.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${exportResult.filename}"`,
    );
    res.send(exportResult.buffer);
  }
}
