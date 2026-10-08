import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsIn,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ALLOWED_PRODUCT_TYPES, ALLOWED_PRODUCT_STATUSES } from './create-product.dto';

export class UpdateOutputBatchDto {
  @ApiPropertyOptional({ description: 'Finished Product Name' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ description: 'Finished Product Code' })
  @IsOptional()
  @IsString()
  productCode?: string;

  @ApiPropertyOptional({ enum: ALLOWED_PRODUCT_TYPES })
  @IsOptional()
  @IsIn(ALLOWED_PRODUCT_TYPES)
  productType?: string;

  @ApiPropertyOptional({ description: 'Output quantity' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.0001)
  outputQuantityKg?: number;

  @ApiPropertyOptional({ description: 'Unit' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Production Date' })
  @IsOptional()
  @IsDateString()
  outputDate?: string;

  @ApiPropertyOptional({ enum: ALLOWED_PRODUCT_STATUSES })
  @IsOptional()
  @IsIn(ALLOWED_PRODUCT_STATUSES)
  status?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CancelOutputBatchDto {
  @ApiPropertyOptional({
    description: 'Reason for cancellation or batch quarantine',
    example: 'Quality deviation detected during final inspection',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ProductFilterDto {
  @ApiPropertyOptional({
    description: 'Search by Product Code, Product Name, Output Batch Number, Work Order, or Party Name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by Product Type / Category',
    enum: ALLOWED_PRODUCT_TYPES,
  })
  @IsOptional()
  @IsString()
  productType?: string;

  @ApiPropertyOptional({
    description: 'Filter by Batch / Product status (PRODUCED, READY, DELIVERED, CANCELLED)',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by Party / Buyer UUID',
  })
  @IsOptional()
  @IsString()
  partyId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Production Team UUID',
  })
  @IsOptional()
  @IsString()
  productionTeamId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Production Order UUID or Order Number',
  })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional({
    description: 'Start production date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End production date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  endDate?: string;
}
