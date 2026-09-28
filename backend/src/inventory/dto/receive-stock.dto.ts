import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiveStockDto {
  @ApiPropertyOptional({ description: 'Transaction effective date (ISO)', example: '2026-09-28' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiProperty({ description: 'Yarn count manual text input (e.g. 1/10 OE, 10 ZT (BOTTOM MATERIAL))', example: '1/10 OE' })
  @IsNotEmpty({ message: 'Yarn count is required' })
  @IsString()
  count: string;

  @ApiProperty({ description: 'Party Master UUID (Supplier)', example: 'd3b07384-d113-467a-9a99-97bc618e7e11' })
  @IsNotEmpty({ message: 'Supplier must be selected from Party Master' })
  @IsUUID('4', { message: 'Invalid party ID format' })
  partyId: string;

  @ApiProperty({ description: 'Lot identifier / Inward Lot number', example: 'LOT-2026-042' })
  @IsNotEmpty({ message: 'Lot number is required' })
  @IsString()
  lotNumber: string;

  @ApiProperty({ description: 'Total bags count', example: 50, minimum: 0 })
  @IsNotEmpty({ message: 'Bags count is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  bags: number;

  @ApiProperty({ description: 'Total net weight in Kilograms (Decimal)', example: 2500.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Weight in KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Kilos must be a valid number' })
  @Min(0.0001, { message: 'Kilos must be greater than 0' })
  kilos: number;

  @ApiPropertyOptional({ description: 'Optional Purchase Order number' })
  @IsOptional()
  @IsString()
  poNumber?: string;

  @ApiPropertyOptional({ description: 'Purpose / Process classification' })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Invoice / Challan / Slip number' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Mill lot identifier' })
  @IsOptional()
  @IsString()
  millLotNumber?: string;

  @ApiPropertyOptional({ description: 'Shade / Color code' })
  @IsOptional()
  @IsString()
  shadeCode?: string;

  @ApiPropertyOptional({ description: 'Parent lot ID if this is received from dyeing process (Parent Lot -> Child Lot)' })
  @IsOptional()
  @IsString()
  parentLotId?: string;

  @ApiPropertyOptional({ description: 'Remarks / Notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
