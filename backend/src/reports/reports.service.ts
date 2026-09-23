import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpiSummary() {
    // Return empty / foundational KPI counts without fake hardcoded production numbers
    const [
      totalLotsCount,
      activeLocationsCount,
      productionTeamsCount,
      pendingOrdersCount,
    ] = await Promise.all([
      this.prisma.lot.count(),
      this.prisma.stockLocation.count({ where: { isActive: true } }),
      this.prisma.productionTeam.count({ where: { isActive: true } }),
      this.prisma.productionOrder.count({ where: { status: 'IN_PROGRESS' } }),
    ]);

    return {
      totalLotsCount,
      activeLocationsCount,
      productionTeamsCount,
      pendingOrdersCount,
      totalStockKg: '0.0000',
      receivedKg: '0.0000',
      issuedKg: '0.0000',
      withProductionTeamsKg: '0.0000',
      consumedKg: '0.0000',
    };
  }
}
