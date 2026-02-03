import { Controller,
   Get, Post,Patch,Delete,Param,Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users')
export class UsersController {
  employeeService: any;
  constructor(private readonly usersService: UsersService) {}

  // GET /users -> List all users (admin/founder only).
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER, RoleEnum.CO_FOUNDER)
  // @Get('users')
  // findAll() {
  //   return this.usersService.findAllSafe();
  // }
 
    @Get()
    findAll() {
      //return "hello"
      console.log("user data")
      return this.usersService.findAll();
    }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER)
  @Post('add_users')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER)
  @Get('users/:user_id')
  findOne(@Param('user_id') id: string) {
    return this.usersService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER)
  @Patch('update_users/:user_id')
  update(
    @Param('user_id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ADMIN)
  @Delete('users/:user_id')
  remove(@Param('user_id') id: string) {
    return this.usersService.remove(id);
  }
}

