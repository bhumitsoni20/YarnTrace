import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class YarnService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.yarn.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { lots: true },
        },
      },
      orderBy: { code: 'asc' },
    });
  }
}
