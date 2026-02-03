import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from './leave-type.entity';
import { LeaveApplication } from './leave-application.entity';
import { Employee } from '../../employee/employee.entity';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveType) 
    private typeRepo: Repository<LeaveType>,
    @InjectRepository(LeaveApplication) 
    private appRepo: Repository<LeaveApplication>,
    @InjectRepository(Employee) 
    private empRepo: Repository<Employee>,
  ) {}

  // ================= LEAVE TYPES (CONFIGURATION) =================

  async getAllLeaveTypes(): Promise<LeaveType[]> {
    return await this.typeRepo.find({ order: { created_at: 'DESC' } });
  }

  async getLeaveTypeById(id: string): Promise<LeaveType> {
    const type = await this.typeRepo.findOne({ where: { leave_type_id: id } });
    if (!type) throw new NotFoundException(`Leave Type with ID ${id} not found`);
    return type;
  }

  async createLeaveType(data: Partial<LeaveType>): Promise<LeaveType> {
    const newType = this.typeRepo.create(data);
    return await this.typeRepo.save(newType);
  }

  async updateLeaveType(id: string, data: Partial<LeaveType>): Promise<LeaveType> {
    const type = await this.getLeaveTypeById(id);
    Object.assign(type, data);
    return await this.typeRepo.save(type);
  }

  async deleteLeaveType(id: string): Promise<{ message: string }> {
    const type = await this.getLeaveTypeById(id);
    await this.typeRepo.remove(type);
    return { message: 'Leave type deleted successfully' };
  }

  // ================= LEAVE APPLICATIONS (TRANSACTIONS) =================

  async applyLeave(userId: string, data: any) {
    // 1. Resolve Employee from User Session
    const employee = await this.empRepo.findOne({ where: { user: { id: userId } } });
    if (!employee) throw new NotFoundException('Employee record not found for this user');

    // 2. Validate Leave Type
    const leaveType = await this.getLeaveTypeById(data.leave_type_id);

    // 3. Calculate Duration
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    
    if (start > end) throw new BadRequestException('End date cannot be before start date');

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // 4. Create Record
    const application = this.appRepo.create({
      start_date: data.start_date,
      end_date: data.end_date,
      reason: data.reason,
      total_days: totalDays,
      status: 'Pending',
      employee: employee,
      leave_type: leaveType,
    });

    return await this.appRepo.save(application);
  }

  async updateLeaveStatus(id: string, status: 'Approved' | 'Rejected') {
    const application = await this.appRepo.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Leave application not found');

    application.status = status;
    return await this.appRepo.save(application);
  }

  async getAllApplications() {
    const list = await this.appRepo.find({
      relations: ['employee', 'leave_type'],
      order: { applied_at: 'DESC' },
    });
    return list.map((app) => ({
      request_id: app.id,
      employee_name: app.employee
        ? `${app.employee.emp_first_name} ${app.employee.emp_last_name}`.trim()
        : '—',
      leave_type: app.leave_type?.leave_type_name ?? '—',
      start_date: app.start_date,
      end_date: app.end_date,
      total_days: app.total_days,
      status: app.status,
      reason: app.reason,
    }));
  }

  async getApplicationsByUserId(userId: string) {
    // First find the employee linked to this user
    const employee = await this.empRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!employee) {
      return []; // Return empty array if no employee found
    }

    // Then fetch leave applications for this employee
    const list = await this.appRepo.find({
      where: { employee: { emp_id: employee.emp_id } },
      relations: ['employee', 'leave_type'],
      order: { applied_at: 'DESC' },
    });
    
    return list.map((app) => ({
      request_id: app.id,
      leave_type: app.leave_type?.leave_type_name ?? '—',
      start_date: app.start_date,
      end_date: app.end_date,
      total_days: app.total_days,
      status: app.status,
      reason: app.reason,
    }));
  }
}