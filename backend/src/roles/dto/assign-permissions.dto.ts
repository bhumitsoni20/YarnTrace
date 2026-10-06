import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description: 'Array of permission IDs to assign to the role. This replaces the current set.',
  })
  @IsArray({ message: 'permissionIds must be an array' })
  @ArrayNotEmpty({ message: 'At least one permission ID is required' })
  @IsUUID('4', { each: true, message: 'Each permission ID must be a valid UUID' })
  permissionIds!: string[];
}
