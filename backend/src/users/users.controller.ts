import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/permissions.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission('manage_users')
  @ApiOperation({ summary: 'Get all registered users' })
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      message: 'Users retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @RequirePermission('manage_users')
  @ApiOperation({ summary: 'Get user details by ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(id);
    return {
      message: 'User retrieved successfully',
      data,
    };
  }
}
