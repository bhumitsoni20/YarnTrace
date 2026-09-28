import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ReturnStockDto {
  @ApiPropertyOptional({ description: 'Transaction effective date (ISO)', example: '2026-09-28' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiProperty({ description: 'Original ISSUE transaction UUID being returned', example: 'd3b07384-d113-467a-9a99-97bc618e7e11' })
  @IsNotEmpty({ message: 'Reference issue transaction ID is required' })
  @IsUUID('4', { message: 'Invalid reference transaction ID format' })
  referenceTransactionId: string;

  @ApiPropertyOptional({ description: 'Yarn count manual text' })
  @IsOptional()
  @IsString()
  count?: string;

  @ApiPropertyOptional({ description: 'Party Master UUID' })
  @IsOptional()
  @IsUUID('4')
  partyId?: string;

  @ApiPropertyOptional({ description: 'Lot identifier' })
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiProperty({ description: 'Total bags count being returned', example: 2, minimum: 0 })
  @IsNotEmpty({ message: 'Bags count is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  bags: number;

  @ApiProperty({ description: 'Total net weight in Kilograms being returned (Decimal)', example: 100.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Weight in KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Kilos must be a valid number' })
  @Min(0.0001, { message: 'Kilos must be greater than 0' })
  kilos: number;

  @ApiPropertyOptional({ description: 'Return slip / Challan number' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Remarks / Reason for return from production floor' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
