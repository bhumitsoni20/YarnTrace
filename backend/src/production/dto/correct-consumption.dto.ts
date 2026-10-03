import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CorrectConsumptionDto {
  @ApiProperty({ description: 'Corrected actual yarn consumed in KG', example: 95.0, minimum: 0 })
  @IsNotEmpty({ message: 'Corrected consumed KG is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Consumed weight must be a valid number' })
  @Min(0, { message: 'Consumed weight cannot be negative' })
  newConsumedKg: number;

  @ApiPropertyOptional({ description: 'Corrected waste in KG', example: 1.5, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Waste weight must be a valid number' })
  @Min(0, { message: 'Waste cannot be negative' })
  newWasteKg?: number;

  @ApiPropertyOptional({ description: 'Corrected bags count', example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Bags must be a number' })
  @Min(0, { message: 'Bags cannot be negative' })
  newBags?: number;

  @ApiProperty({ description: 'Mandatory reason for consumption record correction', example: 'Scale recalibration correction' })
  @IsNotEmpty({ message: 'Correction reason is mandatory' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ description: 'Additional remarks / Authorization notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
