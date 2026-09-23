import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.purchaseOrder.findMany({
      include: {
        party: true,
        requirements: {
          include: { yarn: true },
        },
      },
      orderBy: { orderDate: 'desc' },
    });
  }
}
