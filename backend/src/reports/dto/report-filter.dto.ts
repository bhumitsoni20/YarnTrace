import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportFilterDto {
  @ApiPropertyOptional({ description: 'Start date filter (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Lot ID filter' })
  @IsOptional()
  @IsString()
  lotId?: string;

  @ApiPropertyOptional({ description: 'Party / Supplier ID filter' })
  @IsOptional()
  @IsString()
  partyId?: string;

  @ApiPropertyOptional({ description: 'Transaction type filter' })
  @IsOptional()
  @IsString()
  transactionType?: string;

  @ApiPropertyOptional({ description: 'Yarn Count filter' })
  @IsOptional()
  @IsString()
  yarnCount?: string;

  @ApiPropertyOptional({ description: 'Production Team ID filter' })
  @IsOptional()
  @IsString()
  productionTeamId?: string;

  @ApiPropertyOptional({ description: 'Product ID filter' })
  @IsOptional()
  @IsString()
  productId?: string;
}
