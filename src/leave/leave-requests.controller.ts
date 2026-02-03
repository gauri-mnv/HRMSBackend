import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LeaveService } from './entities/leave.service';

@Controller('leave_requests')

export class LeaveRequestsController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('all')
  async getAll() {
    const data = await this.leaveService.getAllApplications();
    console.log("data leave",data);
    return { success: true, data };
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyRequests(@Req() req: any) {
    console.log('USER FROM TOKEN:', req.user);
    const userId = req.user?.userId ?? req.user?.sub ?? req.user?.id;
    if (!userId) return { success: true, data: [] };
    const data = await this.leaveService.getApplicationsByUserId(userId);
    console.log("me leaves",data);
    return { success: true, data };
  }
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async apply(
        @Req() req: any, 
        @Body() body: { 
                                                leave_type_id: string; 
                                                start_date: string; 
                                                end_date: string; 
                                                reason?: string }) 
                                                {
                 // console.log('USER FROM TOKEN:', req.user);
    const userId = req.user?.userId ?? req.user?.sub ?? req.user?.id;
    console.log(req.user);
    console.log(userId);
    if (!userId) throw new Error('User not found');
    const application = await this.leaveService.applyLeave(userId, body);
    console.log("application" ,application);

    return { success: true, data: application };
  }

  @Put('update_status')
  async updateStatus(
    @Body('request_id') requestId: string,
    @Body('status') status: 'Approved' | 'Rejected',
  ) {
    await this.leaveService.updateLeaveStatus(requestId, status);

    return { success: true, message: 'Leave status updated' };
  }
}
