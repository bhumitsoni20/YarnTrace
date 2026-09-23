import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TraceabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async traceForwardByLot(lotNumber: string) {
    const lot = await this.prisma.lot.findUnique({
      where: { lotNumber },
      include: {
        yarn: true,
        supplier: true,
        stockBalances: { include: { location: true } },
        transactionItems: {
          include: {
            transaction: true,
            sourceLocation: true,
            targetLocation: true,
          },
        },
        yarnAllocations: {
          include: {
            productionOrder: {
              include: {
                products: {
                  include: {
                    deliveries: {
                      include: { party: true },
                    },
                  },
                },
              },
            },
            productionTeam: true,
          },
        },
        consumptionRecords: {
          include: {
            productionOrder: true,
            productionTeam: true,
          },
        },
      },
    });

    if (!lot) {
      throw new NotFoundException(`Yarn lot "${lotNumber}" not found for forward trace`);
    }

    return {
      lotNumber: lot.lotNumber,
      yarn: lot.yarn,
      supplier: lot.supplier,
      currentStatus: lot.status,
      receivedDate: lot.receivedDate,
      initialWeightKg: lot.initialWeightKg,
      currentWeightKg: lot.currentWeightKg,
      allocations: lot.yarnAllocations,
      consumption: lot.consumptionRecords,
      transactions: lot.transactionItems,
    };
  }

  async traceBackwardByProduct(productCode: string) {
    const product = await this.prisma.product.findUnique({
      where: { productCode },
      include: {
        productionOrder: {
          include: {
            allocations: {
              include: {
                lot: {
                  include: {
                    yarn: true,
                    supplier: true,
                  },
                },
                productionTeam: true,
              },
            },
            consumptionRecords: {
              include: {
                lot: {
                  include: {
                    yarn: true,
                  },
                },
                productionTeam: true,
              },
            },
          },
        },
        deliveries: {
          include: {
            party: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product "${productCode}" not found for backward trace`);
    }

    return product;
  }
}
