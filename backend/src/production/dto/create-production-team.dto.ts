import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductionTeamDto {
  @ApiProperty({ description: 'Unique code for team', example: 'SPIN-B' })
  @IsNotEmpty({ message: 'Team code is required' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Production Team Name', example: 'Spinning Team Beta' })
  @IsNotEmpty({ message: 'Team name is required' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Department / Team category', example: 'SPINNING' })
  @IsNotEmpty({ message: 'Department is required' })
  @IsString()
  department: string;

  @ApiPropertyOptional({ description: 'Responsible team lead name', example: 'Vikram Patel' })
  @IsOptional()
  @IsString()
  teamLead?: string;

  @ApiPropertyOptional({ description: 'Team notes / remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
