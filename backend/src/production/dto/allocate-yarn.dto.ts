import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class AllocateYarnDto {
  @ApiProperty({ description: 'Source ISSUED Inventory Transaction UUID', example: 'c1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d' })
  @IsNotEmpty({ message: 'Source issue transaction ID is required' })
  @IsUUID('4', { message: 'Invalid transaction ID format' })
  inventoryTransactionId: string;

  @ApiProperty({ description: 'Production Team UUID receiving the allocation', example: 'd3b07384-d113-467a-9a99-97bc618e7e11' })
  @IsNotEmpty({ message: 'Production team is required' })
  @IsUUID('4', { message: 'Invalid team ID format' })
  productionTeamId: string;

  @ApiProperty({ description: 'Net weight in KG to allocate from issued lot', example: 300.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Allocated KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Allocated weight must be a valid number' })
  @Min(0.0001, { message: 'Allocated weight must be greater than 0' })
  allocatedKg: number;

  @ApiPropertyOptional({ description: 'Bags count allocated', example: 3, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  bags?: number;

  @ApiPropertyOptional({ description: 'Allocation date (ISO)', example: '2026-09-29' })
  @IsOptional()
  @IsDateString()
  allocatedDate?: string;

  @ApiPropertyOptional({ description: 'Remarks / Allocation notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
