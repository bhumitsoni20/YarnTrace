import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class RecordProductionReturnDto {
  @ApiProperty({ description: 'Yarn Allocation UUID from which unused yarn is being returned', example: 'c1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d' })
  @IsNotEmpty({ message: 'Yarn Allocation ID is required' })
  @IsUUID('4', { message: 'Invalid allocation ID format' })
  yarnAllocationId: string;

  @ApiProperty({ description: 'Quantity in KG returning from floor team to Main Stock', example: 50.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Returned KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Returned weight must be a valid number' })
  @Min(0.0001, { message: 'Returned weight must be greater than 0' })
  returnedKg: number;

  @ApiPropertyOptional({ description: 'Bags count returning to main warehouse', example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  returnedBags?: number;

  @ApiPropertyOptional({ description: 'Return timestamp (ISO)', example: '2026-09-29' })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiPropertyOptional({ description: 'Reason for return', example: 'Batch completed with surplus yarn' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Remarks / Notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
