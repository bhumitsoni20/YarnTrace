import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class AddOpeningStockDto {
  @ApiPropertyOptional({ description: 'Transaction effective date (ISO)', example: '2026-08-30' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiProperty({ description: 'Yarn count manual text input (e.g., 1/10 KW, 10 + 80 PVA, 16+80 ZT)', example: '1/10 KW' })
  @IsNotEmpty({ message: 'Yarn count is required' })
  @IsString()
  count: string;

  @ApiProperty({ description: 'Party Master UUID', example: 'd3b07384-d113-467a-9a99-97bc618e7e11' })
  @IsNotEmpty({ message: 'Party must be selected from Party Master' })
  @IsUUID('4', { message: 'Invalid party ID format' })
  partyId: string;

  @ApiProperty({ description: 'Lot identifier / Mill Lot code', example: 'LOT-2026-001' })
  @IsNotEmpty({ message: 'Lot number is required' })
  @IsString()
  lotNumber: string;

  @ApiProperty({ description: 'Total bags count', example: 100, minimum: 0 })
  @IsNotEmpty({ message: 'Bags count is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  bags: number;

  @ApiProperty({ description: 'Total net weight in Kilograms (Decimal)', example: 5000.5, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Weight in KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Kilos must be a valid number' })
  @Min(0.0001, { message: 'Kilos must be greater than 0' })
  kilos: number;

  @ApiPropertyOptional({ description: 'Mill lot identifier if different', example: 'MILL-992' })
  @IsOptional()
  @IsString()
  millLotNumber?: string;

  @ApiPropertyOptional({ description: 'Shade / Color code', example: 'RAW-NATURAL' })
  @IsOptional()
  @IsString()
  shadeCode?: string;

  @ApiPropertyOptional({ description: 'Optional remarks or baseline reference note', example: 'Excel Baseline Opening 30-Aug-2026' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
