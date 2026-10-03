import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateProductionTeamDto {
  @ApiPropertyOptional({ description: 'Production Team Name', example: 'Spinning Team Beta' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Department / Team category', example: 'SPINNING' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Responsible team lead name', example: 'Vikram Patel' })
  @IsOptional()
  @IsString()
  teamLead?: string;

  @ApiPropertyOptional({ description: 'Team notes / remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
