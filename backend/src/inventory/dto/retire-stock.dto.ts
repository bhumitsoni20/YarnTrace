import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class RetireStockDto {
  @ApiPropertyOptional({ description: 'Transaction effective date (ISO)', example: '2026-09-28' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiProperty({ description: 'Lot identifier to retire stock from', example: 'LOT-2026-001' })
  @IsNotEmpty({ message: 'Lot number is required' })
  @IsString()
  lotNumber: string;

  @ApiPropertyOptional({ description: 'Yarn count text' })
  @IsOptional()
  @IsString()
  count?: string;

  @ApiPropertyOptional({ description: 'Party Master UUID' })
  @IsOptional()
  @IsUUID('4')
  partyId?: string;

  @ApiProperty({ description: 'Total bags count to retire', example: 5, minimum: 0 })
  @IsNotEmpty({ message: 'Bags count is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  bags: number;

  @ApiProperty({ description: 'Total net weight in Kilograms to retire (Decimal)', example: 250.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Weight in KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Kilos must be a valid number' })
  @Min(0.0001, { message: 'Kilos must be greater than 0' })
  kilos: number;

  @ApiProperty({ description: 'Mandatory reason/justification for retirement (damage, contamination, audit write-off)', example: 'Contamination during storage - QA write-off approved' })
  @IsNotEmpty({ message: 'Mandatory retirement reason/remarks is required' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ description: 'QA report / Write-off slip reference' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;
}
