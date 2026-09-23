import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getStockSummary() {
    const balances = await this.prisma.stockBalance.findMany({
      include: {
        lot: {
          include: {
            yarn: true,
            supplier: true,
          },
        },
        location: true,
      },
    });

    return balances;
  }

  async getLocations() {
    return this.prisma.stockLocation.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { stockBalances: true },
        },
      },
      orderBy: { code: 'asc' },
    });
  }
}
