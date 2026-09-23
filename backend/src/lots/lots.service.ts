import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LotsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.lot.findMany({
      include: {
        yarn: true,
        supplier: {
          select: { id: true, name: true, code: true },
        },
        stockBalances: {
          include: { location: true },
        },
      },
      orderBy: { receivedDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const lot = await this.prisma.lot.findUnique({
      where: { id },
      include: {
        yarn: true,
        supplier: true,
        stockBalances: {
          include: { location: true },
        },
        transactionItems: {
          include: {
            transaction: true,
            sourceLocation: true,
            targetLocation: true,
          },
        },
        yarnAllocations: {
          include: {
            productionOrder: true,
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
      throw new NotFoundException(`Lot with ID "${id}" not found`);
    }

    return lot;
  }
}
