import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

// @Controller()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(
    
    private readonly rolesService: RolesService

    ) {}

  @Get('access_rules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.rolesService.findAll();
  }

  @Post('add_rules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body('name') name: string) {
    return this.rolesService.create(name);
  }

  @Get('job_roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch('update_roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.rolesService.update(id, name);
  }

  @Delete('delete_roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
