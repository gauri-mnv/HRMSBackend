import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';

@Controller('emps')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // GET /emps -> List all employees. (admin)
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    //return "hi"
   return this.employeeService.findAll();
  }

  // POST /add_emps -> Create a new employee.
  // @UseGuards(JwtAuthGuard)
  @Post('add_emps')
   create(@Body() dto: CreateEmployeeDto) {
    //return "emp added";
    return this.employeeService.create(dto);
  
  }

  // POST /emps/from-user/:userId -> Create employee record from existing user (admin).
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER, RoleEnum.CO_FOUNDER)
  @Post('emps/from-user/:userId')
  createFromUser(@Param('userId') userId: string) {
    return this.employeeService.createFromUserId(userId);
  }

  // GET /emps/:emp_id -> Retrieve a specific employee.
  @Get('emps/:emp_id')
  findOne(@Param('emp_id') emp_id: string) {
    return this.employeeService.findOne(String(emp_id));
  }

  // GET /employee/me -> Retrieve currently logged-in employee (by user id).
  // @UseGuards(JwtAuthGuard)
  @Get('employee/me')
  findMe(@Req() req: any) {
    return this.employeeService.findByUserId(req.user.userId);
  }

  // PATCH /update_emps/:emp_id -> Update a specific employee.
  @Patch('update_emps/:emp_id')
  update(
    @Param('emp_id') emp_id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(String(emp_id), dto);
  }

  // PATCH /employee/me -> Employee self-service update (limited fields).
  // @UseGuards(JwtAuthGuard)
  @Patch('employee/me')
  updateMe(@Req() req: any, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.updateByUserId(req.user.userId, dto);
  }

  // DELETE /emps/:emp_id -> Soft delete a specific employee.
  @Delete('emps/:emp_id')
  remove(@Param('emp_id') emp_id: string) {
    return this.employeeService.softDelete(String(emp_id));
  }
}

