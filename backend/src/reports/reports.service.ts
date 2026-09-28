import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpiSummary() {
    const [
      lotAgg,
      rcvAgg,
      issAgg,
      totalLotsCount,
      activeLocationsCount,
      productionTeamsCount,
      pendingOrdersCount,
    ] = await Promise.all([
      this.prisma.lot.aggregate({
        _sum: { currentWeightKg: true, currentBags: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: 'RECEIVED' },
        _sum: { kilos: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: 'ISSUED' },
        _sum: { kilos: true },
      }),
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
      totalStockKg: Number(lotAgg._sum.currentWeightKg || 0).toFixed(4),
      receivedKg: Number(rcvAgg._sum.kilos || 0).toFixed(4),
      issuedKg: Number(issAgg._sum.kilos || 0).toFixed(4),
      withProductionTeamsKg: '0.0000',
      consumedKg: '0.0000',
    };
  }
}
