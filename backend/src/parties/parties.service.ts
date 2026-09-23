import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.party.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            suppliedLots: true,
            purchaseOrders: true,
            deliveries: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
