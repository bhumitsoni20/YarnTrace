import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductionOrderStatus } from '@prisma/client';

export class UpdateProductionOrderDto {
  @ApiPropertyOptional({ description: 'Planned target production quantity in KG', example: 1000.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Target quantity must be a valid number' })
  @Min(0.0001, { message: 'Target quantity must be greater than 0' })
  targetQuantity?: number;

  @ApiPropertyOptional({ description: 'Unit of measurement' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Order Priority', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: 'Production Purpose / Process' })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Output Product Name / Description' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ description: 'Product Type / Category' })
  @IsOptional()
  @IsString()
  productType?: string;

  @ApiPropertyOptional({ description: 'Linked Purchase Order Number' })
  @IsOptional()
  @IsString()
  poNumber?: string;

  @ApiPropertyOptional({ description: 'Party Master UUID' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid party ID format' })
  partyId?: string;

  @ApiPropertyOptional({ description: 'Assigned Production Team UUID' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid team ID format' })
  productionTeamId?: string;

  @ApiPropertyOptional({ description: 'Planned start date (ISO)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Planned target completion date (ISO)' })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional({ description: 'Lifecycle status', enum: ProductionOrderStatus })
  @IsOptional()
  @IsEnum(ProductionOrderStatus)
  status?: ProductionOrderStatus;

  @ApiPropertyOptional({ description: 'Notes / Remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
