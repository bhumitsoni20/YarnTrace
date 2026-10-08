import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(dto: CreateAuditLogDto) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          userId: dto.userId,
          action: dto.action,
          module: dto.module,
          entityType: dto.entityType,
          entityId: dto.entityId,
          oldValue: dto.oldValue ? JSON.parse(JSON.stringify(dto.oldValue)) : undefined,
          newValue: dto.newValue ? JSON.parse(JSON.stringify(dto.newValue)) : undefined,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
          metadata: dto.metadata ? JSON.parse(JSON.stringify(dto.metadata)) : undefined,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to persist audit log for action: ${dto.action}`,
        (error as Error).stack,
      );
      return null;
    }
  }

  async getLogs(filter: {
    page?: number;
    limit?: number;
    module?: string;
    action?: string;
    search?: string;
  }) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filter.limit) || 25));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filter.module && filter.module !== 'ALL') {
      where.module = filter.module;
    }
    if (filter.action && filter.action !== 'ALL') {
      where.action = filter.action;
    }
    if (filter.search) {
      where.OR = [
        { entityType: { contains: filter.search, mode: 'insensitive' } },
        { action: { contains: filter.search, mode: 'insensitive' } },
        { user: { email: { contains: filter.search, mode: 'insensitive' } } },
      ];
    }

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        take: limit,
        skip,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRecentLogs(limit = 50) {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
