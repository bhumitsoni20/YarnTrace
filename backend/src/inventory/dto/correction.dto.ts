import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CorrectionDto {
  @ApiProperty({ description: 'Original transaction UUID to be reversed/corrected', example: 'd3b07384-d113-467a-9a99-97bc618e7e11' })
  @IsNotEmpty({ message: 'Reference transaction ID is required' })
  @IsUUID('4', { message: 'Invalid transaction ID format' })
  referenceTransactionId: string;

  @ApiProperty({ description: 'Mandatory reason for transaction reversal / correction', example: 'Weight entry error on inward slip - corrected to physical scale receipt' })
  @IsNotEmpty({ message: 'Correction reason is required' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ description: 'If creating a replacement corrected transaction, specify new count' })
  @IsOptional()
  @IsString()
  correctedCount?: string;

  @ApiPropertyOptional({ description: 'If creating a replacement corrected transaction, specify new Party UUID' })
  @IsOptional()
  @IsUUID('4')
  correctedPartyId?: string;

  @ApiPropertyOptional({ description: 'If creating a replacement corrected transaction, specify new Lot number' })
  @IsOptional()
  @IsString()
  correctedLotNumber?: string;

  @ApiPropertyOptional({ description: 'If creating a replacement corrected transaction, specify new Bags count' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  correctedBags?: number;

  @ApiPropertyOptional({ description: 'If creating a replacement corrected transaction, specify new Weight in KG' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.0001)
  correctedKilos?: number;

  @ApiPropertyOptional({ description: 'Corrected PO number' })
  @IsOptional()
  @IsString()
  correctedPoNumber?: string;

  @ApiPropertyOptional({ description: 'Corrected Purpose' })
  @IsOptional()
  @IsString()
  correctedPurpose?: string;

  @ApiPropertyOptional({ description: 'Additional remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
