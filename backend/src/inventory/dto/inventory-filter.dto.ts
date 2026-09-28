import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class InventoryFilterDto {
  @ApiPropertyOptional({ description: 'Full-text search query across Lot, Count, Party name, PO Number' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by yarn count (manual count string)' })
  @IsOptional()
  @IsString()
  count?: string;

  @ApiPropertyOptional({ description: 'Filter by party ID (Party Master)' })
  @IsOptional()
  @IsString()
  partyId?: string;

  @ApiPropertyOptional({ description: 'Filter by lot number' })
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiPropertyOptional({ description: 'Filter by transaction type', enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({ description: 'Filter by production purpose' })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Filter by PO number' })
  @IsOptional()
  @IsString()
  poNumber?: string;

  @ApiPropertyOptional({ description: 'Filter transactions from date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter transactions to date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 50;
}
