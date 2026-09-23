import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  action!: string;

  @IsNotEmpty()
  @IsString()
  module!: string;

  @IsNotEmpty()
  @IsString()
  entityType!: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  oldValue?: Record<string, unknown> | unknown;

  @IsOptional()
  newValue?: Record<string, unknown> | unknown;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  metadata?: Record<string, unknown> | unknown;
}
