import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TraceabilityService } from './traceability.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Traceability Engine')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('traceability')
export class TraceabilityController {
  constructor(private readonly traceabilityService: TraceabilityService) {}

  @Get('forward/lot/:lotNumber')
  @RequirePermission('view_traceability')
  @ApiOperation({
    summary: 'Forward Traceability: Yarn Lot -> Production -> Output Products -> Party Deliveries',
  })
  async traceForward(@Param('lotNumber') lotNumber: string) {
    const data = await this.traceabilityService.traceForwardByLot(lotNumber);
    return {
      message: 'Forward traceability trail retrieved',
      data,
    };
  }

  @Get('backward/product/:productCode')
  @RequirePermission('view_traceability')
  @ApiOperation({
    summary: 'Backward Traceability: Finished Product / Delivery -> Production Order -> Raw Yarn Lots',
  })
  async traceBackward(@Param('productCode') productCode: string) {
    const data = await this.traceabilityService.traceBackwardByProduct(productCode);
    return {
      message: 'Backward traceability trail retrieved',
      data,
    };
  }
}
