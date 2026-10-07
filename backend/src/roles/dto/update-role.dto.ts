import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Floor Supervisor' })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Role name must be at least 2 characters' })
  @MaxLength(100, { message: 'Role name must not exceed 100 characters' })
  name?: string;

  @ApiPropertyOptional({ example: 'Supervisor for the production floor' })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}
