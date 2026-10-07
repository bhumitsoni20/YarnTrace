import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Floor Supervisor', description: 'Human-readable role name' })
  @IsString()
  @IsNotEmpty({ message: 'Role name is required' })
  @MinLength(2, { message: 'Role name must be at least 2 characters' })
  @MaxLength(100, { message: 'Role name must not exceed 100 characters' })
  name!: string;

  @ApiProperty({ example: 'FLOOR_SUPERVISOR', description: 'Unique uppercase role code (letters, digits, underscores)' })
  @IsString()
  @IsNotEmpty({ message: 'Role code is required' })
  @MinLength(2, { message: 'Role code must be at least 2 characters' })
  @MaxLength(50, { message: 'Role code must not exceed 50 characters' })
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'Role code must start with a letter and contain only uppercase letters, digits, and underscores',
  })
  code!: string;

  @ApiPropertyOptional({ example: 'Supervisor for the production floor' })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}
