import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class IssueStockDto {
  @ApiPropertyOptional({ description: 'Transaction effective date (ISO)', example: '2026-09-28' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiProperty({ description: 'Yarn count manual text input (e.g., 1/10 KW)', example: '1/10 KW' })
  @IsNotEmpty({ message: 'Yarn count is required' })
  @IsString()
  count: string;

  @ApiProperty({ description: 'Party Master UUID', example: 'd3b07384-d113-467a-9a99-97bc618e7e11' })
  @IsNotEmpty({ message: 'Party must be selected from Party Master' })
  @IsUUID('4', { message: 'Invalid party ID format' })
  partyId: string;

  @ApiProperty({ description: 'Lot identifier to issue from', example: 'LOT-2026-001' })
  @IsNotEmpty({ message: 'Lot number is required' })
  @IsString()
  lotNumber: string;

  @ApiProperty({ description: 'Total bags count to issue', example: 10, minimum: 0 })
  @IsNotEmpty({ message: 'Bags count is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  bags: number;

  @ApiProperty({ description: 'Total net weight in Kilograms to issue (Decimal)', example: 500.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Weight in KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Kilos must be a valid number' })
  @Min(0.0001, { message: 'Kilos must be greater than 0' })
  kilos: number;

  @ApiPropertyOptional({ description: 'Purchase Order number for 103% ceiling verification', example: 'PO-2026-8801' })
  @IsOptional()
  @IsString()
  poNumber?: string;

  @ApiPropertyOptional({ description: 'Direct PO Requirement UUID if linked directly' })
  @IsOptional()
  @IsString()
  poRequirementId?: string;

  @ApiProperty({ description: 'Production purpose (PILE, GROUND, WEFT, DYED, NPD, GENERAL)', example: 'PILE' })
  @IsNotEmpty({ message: 'Purpose is required for yarn issuance' })
  @IsString()
  purpose: string;

  @ApiPropertyOptional({ description: 'Yarn slip / Requisition / Delivery challan number' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Remarks / Notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
