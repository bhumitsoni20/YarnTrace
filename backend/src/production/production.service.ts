import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeams() {
    return this.prisma.productionTeam.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { allocations: true, consumptionRecords: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getOrders() {
    return this.prisma.productionOrder.findMany({
      include: {
        allocations: {
          include: {
            lot: { include: { yarn: true } },
            productionTeam: true,
          },
        },
        consumptionRecords: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
