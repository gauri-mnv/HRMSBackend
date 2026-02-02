import { 
    Controller, Get, Post, Body, Patch, Param, Delete, UseGuards 
  } from '@nestjs/common';
  import { DepartmentService } from './department.service';
  import { CreateDepartmentDto } from './dto/create-department.dto';
  import { UpdateDepartmentDto } from './dto/update-department.dto';
  import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { RoleEnum } from '../common/enums/role.enum';
  
  @Controller('depts')
  //@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes
  export class DepartmentController {
    constructor(private readonly deptService: DepartmentService) {}
  
    // GET /depts -> Show all departments with manager/head
    @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER, RoleEnum.CO_FOUNDER)
    @Get()
    findAll() {
      console.log("depts")
       return this.deptService.findAll();
     // return "depts"
    }
  
    // POST /add_depts -> Create a new department
    @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER, RoleEnum.CO_FOUNDER)
    @Post('add_depts')
    create(@Body() dto: CreateDepartmentDto) {
      return this.deptService.create(dto);
    }
  
    // GET /depts/:dept_id -> Retrieve specific department + working employee list
    @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER, RoleEnum.CO_FOUNDER)
    @Get(':dept_id')
    findOne(@Param('dept_id') id: string) {
      return this.deptService.findOne(id);
    }
  
    // PATCH /update_depts/:dept_id -> Update specific department
    @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER, RoleEnum.CO_FOUNDER)
    @Patch('update_depts/:dept_id')
    update(@Param('dept_id') id: string, @Body() dto: UpdateDepartmentDto) {
      return this.deptService.update(id, dto);
    }
  
    // DELETE /depts/:dept_id -> Delete specific department
    @Roles(RoleEnum.ADMIN, RoleEnum.FOUNDER, RoleEnum.CO_FOUNDER)
    @Delete(':dept_id')
    remove(@Param('dept_id') id: string) {
      return this.deptService.remove(id);
    }
  }