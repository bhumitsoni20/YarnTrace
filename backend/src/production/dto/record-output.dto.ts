import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class RecordProductionOutputDto {
  @ApiProperty({ description: 'Finished Product Name / SKU description', example: '100% Cotton Grey Fabric 40s' })
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName: string;

  @ApiPropertyOptional({ description: 'Product Code / SKU identifier', example: 'PROD-FAB-401' })
  @IsOptional()
  @IsString()
  productCode?: string;

  @ApiProperty({ description: 'Finished production output quantity in KG', example: 580.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Output quantity is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Output quantity must be a valid number' })
  @Min(0.0001, { message: 'Output quantity must be greater than 0' })
  outputQuantityKg: number;

  @ApiPropertyOptional({ description: 'Unit of measurement', default: 'KG' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Output completion date (ISO)', example: '2026-09-29' })
  @IsOptional()
  @IsDateString()
  outputDate?: string;

  @ApiPropertyOptional({ description: 'Remarks / Batch inspection notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
