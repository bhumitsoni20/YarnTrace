import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePORequirementDto } from './create-purchase-order.dto';

export class UpdatePurchaseOrderDto {
  @ApiPropertyOptional({ description: 'Party Master UUID (Customer / Buyer)' })
  @IsOptional()
  @IsUUID('4')
  partyId?: string;

  @ApiPropertyOptional({ description: 'Order effective date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @ApiPropertyOptional({ description: 'Required shipment / delivery due date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  deliveryDue?: string;

  @ApiPropertyOptional({ description: 'Total commercial amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional({ description: 'Order level remarks or special notes' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: 'PO Lifecycle Status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Updated requirement lines (existing lines with ID will be updated, new lines created)',
    type: [CreatePORequirementDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePORequirementDto)
  requirements?: CreatePORequirementDto[];
}

export class CancelPurchaseOrderDto {
  @ApiPropertyOptional({ description: 'Reason for PO cancellation', example: 'Customer cancelled order or changed specifications' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class PurchaseOrderFilterDto {
  @ApiPropertyOptional({ description: 'Search term for PO number, party name, party code, or yarn count' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by Party UUID' })
  @IsOptional()
  @IsUUID('4')
  partyId?: string;

  @ApiPropertyOptional({ description: 'Filter by PO Status (DRAFT, ACTIVE, CONFIRMED, PARTIALLY_FULFILLED, FULFILLED, CANCELLED)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by Fulfillment Status (PENDING, PARTIAL, COMPLETED)' })
  @IsOptional()
  @IsString()
  fulfillmentStatus?: string;

  @ApiPropertyOptional({ description: 'Start date filter (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
