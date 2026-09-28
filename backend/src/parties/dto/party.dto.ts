import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsEmail, IsBoolean } from 'class-validator';
import { PartyType } from '@prisma/client';

export class CreatePartyDto {
  @ApiProperty({ description: 'Unique party identifier / short code', example: 'VARDHMAN' })
  @IsNotEmpty({ message: 'Party code is required' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Legal entity or trading name', example: 'Vardhman Textiles Ltd' })
  @IsNotEmpty({ message: 'Party name is required' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Party type classification', enum: PartyType, example: PartyType.SUPPLIER })
  @IsNotEmpty({ message: 'Party type is required' })
  @IsEnum(PartyType)
  type: PartyType;

  @ApiPropertyOptional({ description: 'Primary contact person', example: 'Rajesh Sharma' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Contact email address', example: 'sales@vardhman.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Contact phone number', example: '+919812345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Physical address / Mill location' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'GSTIN tax identification number' })
  @IsOptional()
  @IsString()
  gstNumber?: string;
}

export class UpdatePartyDto {
  @ApiPropertyOptional({ description: 'Party name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Party type', enum: PartyType })
  @IsOptional()
  @IsEnum(PartyType)
  type?: PartyType;

  @ApiPropertyOptional({ description: 'Contact person' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Physical address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'GST number' })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({ description: 'Active status flag' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
