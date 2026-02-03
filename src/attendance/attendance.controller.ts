import { Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleEnum } from "src/common/enums/role.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";





@Controller('attendance')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}
//   @Get()
//   @UseGuards(JwtAuthGuard)
//   @Roles(RoleEnum.ADMIN, RoleEnum.HR, RoleEnum.MANAGER)
//   async getAllAttendance() {
//     try {
//       const records = await this.attendanceService.getAllAttendance();
//       return {
//         success: true,
//         data: records,
//       };
//     } catch (error) {
//       throw new InternalServerErrorException(
//         'Failed to fetch all attendance records',
//       );
//     }
//   }

  @Get()
// @UseGuards(JwtAuthGuard)
// @Roles(RoleEnum.ADMIN, RoleEnum.HR, RoleEnum.MANAGER)
async findAll() {
  try {
    const records = await this.attendanceService.findAll();
    return {
      success: true,
      data: records,
    };
  } catch (error) {
    throw new InternalServerErrorException(
      'Failed to fetch attendance records',
    );
  }
}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyAttendance(@Req() req: any) {
    const userId = req.user?.userId ?? req.user?.sub ?? req.user?.id;
    console.log("attendance me ",userId)
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    try {
      const records = await this.attendanceService.getMyAttendance(userId);
      console.log("attendance me ",records)
      return {
        success: true,
        data: records,
      };
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch attendance logs', error);
    }
  }
  @Post('auto-checkout')
//   @UseGuards(JwtAuthGuard)
  async logoutCheckOut(@Req() req) {
    const userId = req.user.id || req.user.sub;
    return this.attendanceService.autoCheckOut(userId);
  }
  // 2. Attendance Check-in
//   @Post('check-in')
//   async checkIn(@Req() req) {
//     const userId = req.user.id || req.user.sub;
//     return this.attendanceService.checkIn(userId);
//   }

//   // 3. Attendance Check-out
//   @Post('check-out')
//   async checkOut(@Req() req) {
//     const userId = req.user.id || req.user.sub;
//     return this.attendanceService.checkOut(userId);
//   }

  @Get(':at_emp_id')
  async getByEmployee(@Param('at_emp_id') id: string) {
    const records = await this.attendanceService.getAttendanceByEmployee(id);
    return { success: true, data: records };
  }

}