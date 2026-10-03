import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class RecordConsumptionDto {
  @ApiProperty({ description: 'Yarn Allocation UUID to consume from', example: 'c1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d' })
  @IsNotEmpty({ message: 'Yarn Allocation ID is required' })
  @IsUUID('4', { message: 'Invalid allocation ID format' })
  yarnAllocationId: string;

  @ApiProperty({ description: 'Actual yarn consumed in KG', example: 100.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Consumed KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Consumed weight must be a valid number' })
  @Min(0.0001, { message: 'Consumed weight must be greater than 0' })
  consumedKg: number;

  @ApiPropertyOptional({ description: 'Waste / Loss generated in KG', example: 2.5, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Waste weight must be a valid number' })
  @Min(0, { message: 'Waste cannot be negative' })
  wasteKg?: number;

  @ApiPropertyOptional({ description: 'Waste category (FLY_WASTE, HARD_WASTE, DEFECTIVE, FLOOR_SWEEPING, SIZING_WASTE)', example: 'HARD_WASTE' })
  @IsOptional()
  @IsString()
  wasteCategory?: string;

  @ApiPropertyOptional({ description: 'Bags consumed / emptied', example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  bags?: number;

  @ApiPropertyOptional({ description: 'Net production yield/produced KG from this consumption session', example: 97.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Net produced must be a valid number' })
  @Min(0, { message: 'Net produced cannot be negative' })
  netProducedKg?: number;

  @ApiPropertyOptional({ description: 'Floor process / Purpose', example: 'WEAVING_WEFT' })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Consumption timestamp (ISO)', example: '2026-09-29' })
  @IsOptional()
  @IsDateString()
  consumptionDate?: string;

  @ApiPropertyOptional({ description: 'Remarks / Notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
