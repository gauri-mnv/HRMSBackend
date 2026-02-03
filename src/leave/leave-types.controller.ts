import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { LeaveService } from "./entities/leave.service";

@Controller('leave_types')
// @UseGuards(JwtAuthGuard)
export class LeaveTypesController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get() // List all
  async findAll() {
    return this.leaveService.getAllLeaveTypes();
  }

  @Post('add_leave_types') // Create
  async create(@Body() data: any) {
    return this.leaveService.createLeaveType(data);
  }

  @Get(':leave_type_id') // Retrieve specific
  async findOne(@Param('leave_type_id') id: string) {
    return this.leaveService.getLeaveTypeById(id);
  }

  @Put('update_leave_types/:leave_type_id') // Update
  async update(@Param('leave_type_id') id: string, @Body() data: any) {
    return this.leaveService.updateLeaveType(id, data);
  }

  @Delete('delete_leave_types/:leave_type_id') // Delete
  async remove(@Param('leave_type_id') id: string) {
    return this.leaveService.deleteLeaveType(id);
  }
}