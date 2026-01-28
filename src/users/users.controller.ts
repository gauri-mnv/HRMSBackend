import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users -> List all users (admin/founder only).
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER, RoleEnum.CO_FOUNDER)
  @Get('users')
  findAll() {
    return this.usersService.findAllSafe();
  }
}

