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
