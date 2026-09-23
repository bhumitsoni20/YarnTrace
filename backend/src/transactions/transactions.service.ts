import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        items: {
          include: {
            lot: {
              include: { yarn: true },
            },
            sourceLocation: true,
            targetLocation: true,
          },
        },
      },
      orderBy: { transactionDate: 'desc' },
      take: 100,
    });
  }
}
