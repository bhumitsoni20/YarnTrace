import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class SellStockDto {
  @ApiPropertyOptional({ description: 'Transaction effective date (ISO)', example: '2026-09-28' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiProperty({ description: 'Customer Party Master UUID', example: 'd3b07384-d113-467a-9a99-97bc618e7e11' })
  @IsNotEmpty({ message: 'Customer must be selected from Party Master' })
  @IsUUID('4', { message: 'Invalid customer party ID format' })
  partyId: string;

  @ApiProperty({ description: 'Lot identifier being sold externally', example: 'LOT-2026-001' })
  @IsNotEmpty({ message: 'Lot number is required' })
  @IsString()
  lotNumber: string;

  @ApiProperty({ description: 'Yarn count manual text', example: '1/10 KW' })
  @IsNotEmpty({ message: 'Yarn count is required' })
  @IsString()
  count: string;

  @ApiProperty({ description: 'Total bags count sold', example: 20, minimum: 0 })
  @IsNotEmpty({ message: 'Bags count is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  bags: number;

  @ApiProperty({ description: 'Total net weight in Kilograms sold (Decimal)', example: 1000.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Weight in KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Kilos must be a valid number' })
  @Min(0.0001, { message: 'Kilos must be greater than 0' })
  kilos: number;

  @ApiPropertyOptional({ description: 'Sales invoice / Commercial slip number', example: 'INV-2026-0089' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Remarks / Commercial terms' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
