import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductionOrderStatus } from '@prisma/client';

export class CreateProductionOrderDto {
  @ApiPropertyOptional({ description: 'Human-readable Work Order Number (auto-generated if omitted)', example: 'WO-2026-0001' })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiProperty({ description: 'Planned target production quantity in KG', example: 1000.0, minimum: 0.0001 })
  @IsNotEmpty({ message: 'Target quantity is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Target quantity must be a valid number' })
  @Min(0.0001, { message: 'Target quantity must be greater than 0' })
  targetQuantity: number;

  @ApiPropertyOptional({ description: 'Unit of measurement', default: 'KG' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Order Priority', example: 'MEDIUM', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: 'Production Purpose / Process', example: 'WEAVING' })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Output Product Name / Description', example: '100% Cotton Grey Fabric 40s' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ description: 'Product Type / Category', example: 'FABRIC_ROLL' })
  @IsOptional()
  @IsString()
  productType?: string;

  @ApiPropertyOptional({ description: 'Linked Purchase Order Number', example: 'PO-2026-8801' })
  @IsOptional()
  @IsString()
  poNumber?: string;

  @ApiPropertyOptional({ description: 'Party Master UUID (Customer / Internal)', example: 'd3b07384-d113-467a-9a99-97bc618e7e11' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid party ID format' })
  partyId?: string;

  @ApiPropertyOptional({ description: 'Assigned Production Team UUID' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid team ID format' })
  productionTeamId?: string;

  @ApiPropertyOptional({ description: 'Planned start date (ISO)', example: '2026-09-29' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Planned target completion date (ISO)', example: '2026-10-15' })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional({ description: 'Lifecycle status', enum: ProductionOrderStatus, default: ProductionOrderStatus.PLANNED })
  @IsOptional()
  @IsEnum(ProductionOrderStatus)
  status?: ProductionOrderStatus;

  @ApiPropertyOptional({ description: 'Notes / Remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
