import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Ramesh' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Kumar' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  phoneNumber?: string | null;

  @ApiPropertyOptional({ example: 'uuid-of-role', description: 'ID of the role to assign' })
  @IsUUID('4', { message: 'Role ID must be a valid UUID' })
  @IsOptional()
  roleId?: string;
}
