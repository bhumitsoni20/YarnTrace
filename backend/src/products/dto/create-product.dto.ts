import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsDateString,
  IsIn,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export const ALLOWED_PRODUCT_TYPES = [
  'FABRIC_ROLL',
  'FINISHED_YARN',
  'MANUFACTURED_BATCH',
  'GARMENT',
  'OTHER',
] as const;

export const ALLOWED_PRODUCT_STATUSES = [
  'PRODUCED',
  'READY',
  'DELIVERED',
  'CANCELLED',
] as const;

export class RegisterOutputBatchDto {
  @ApiPropertyOptional({
    description: 'Unique business Output Batch identifier (e.g., OUT-2026-0001). Auto-generated if omitted.',
    example: 'OUT-2026-0001',
  })
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiProperty({
    description: 'Production Work Order ID from which this batch was manufactured',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsNotEmpty({ message: 'Production Order is required' })
  @IsString()
  productionOrderId: string;

  @ApiPropertyOptional({
    description: 'Existing Product Master UUID if linking to existing catalog item',
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({
    description: 'Finished Product Name / Specification',
    example: '100% Combed Cotton Bath Towel Fabric (30x60)',
  })
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  productName: string;

  @ApiPropertyOptional({
    description: 'Finished Product Code (e.g., PROD-FAB-001). Auto-generated if omitted.',
    example: 'PROD-FAB-001',
  })
  @IsOptional()
  @IsString()
  productCode?: string;

  @ApiPropertyOptional({
    description: 'Product category / configuration type',
    enum: ALLOWED_PRODUCT_TYPES,
    example: 'FABRIC_ROLL',
  })
  @IsOptional()
  @IsIn(ALLOWED_PRODUCT_TYPES, {
    message: `Product type must be one of: ${ALLOWED_PRODUCT_TYPES.join(', ')}`,
  })
  productType?: string;

  @ApiProperty({
    description: 'Manufactured Output Quantity (Decimal)',
    example: 450.0,
    minimum: 0.0001,
  })
  @IsNotEmpty({ message: 'Output quantity is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Output quantity must be a valid number' })
  @Min(0.0001, { message: 'Output quantity must be greater than 0' })
  outputQuantityKg: number;

  @ApiPropertyOptional({
    description: 'Quantity unit of measurement',
    example: 'KG',
    default: 'KG',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Production output completion date (ISO format)',
    example: '2026-10-07',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format for production date' })
  outputDate?: string;

  @ApiPropertyOptional({
    description: 'Product / Batch status',
    enum: ALLOWED_PRODUCT_STATUSES,
    default: 'READY',
  })
  @IsOptional()
  @IsIn(ALLOWED_PRODUCT_STATUSES, {
    message: `Status must be one of: ${ALLOWED_PRODUCT_STATUSES.join(', ')}`,
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Production remarks, quality notes, or batch specifications',
    example: 'Inspected Grade A fabric roll output',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreateProductCatalogDto {
  @ApiPropertyOptional({
    description: 'Product Code (e.g., PROD-001). Auto-generated if omitted.',
    example: 'PROD-001',
  })
  @IsOptional()
  @IsString()
  productCode?: string;

  @ApiProperty({
    description: 'Product Name',
    example: '20s Grey Fabric Plain Weave',
  })
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description / specs',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product Category',
    enum: ALLOWED_PRODUCT_TYPES,
    example: 'FABRIC_ROLL',
  })
  @IsOptional()
  @IsIn(ALLOWED_PRODUCT_TYPES)
  category?: string;

  @ApiPropertyOptional({
    description: 'Associated Production Order UUID if dedicated to an order',
  })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional({
    description: 'Unit of measurement',
    example: 'KG',
    default: 'KG',
  })
  @IsOptional()
  @IsString()
  unit?: string;
}
