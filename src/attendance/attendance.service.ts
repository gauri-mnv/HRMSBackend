import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Employee } from "src/employee/employee.entity";
import { Repository } from "typeorm";
import { Attendance } from "./entities/attendance.entity";
import { InjectRepository } from "@nestjs/typeorm";

// src/attendance/attendance.service.ts
@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private atRepo: Repository<Attendance>,
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
  ) {}

  // src/attendance/attendance.service.ts

  // src/attendance/attendance.service.ts

async autoCheckIn(userId: string) {
    // 1. Find the employee linked to this user
    const employee = await this.empRepo.findOne({ 
      where: { user: { id: userId } } 
    });
    
    if (!employee) return; // Guard for users without employee profiles
  
    const today = new Date().toISOString().split('T')[0];
  
    // 2. Check if a record already exists for today
    const existingRecord = await this.atRepo.findOne({
      where: { 
        at_date: today, 
        employee: { emp_id: employee.emp_id } 
      }
    });
  
    // 3. If no record exists, create the "Check-In" log
    if (!existingRecord) {
      const newRecord = this.atRepo.create({
        at_date: today,
        at_in_time: new Date().toLocaleTimeString('en-GB'), // e.g. "09:30:00"
        at_status: 'Present',
        employee: employee,
      });
      await this.atRepo.save(newRecord);
    }
  }
async autoCheckOut(userId: string) {
    // 1. Get the employee
    const employee = await this.empRepo.findOne({ 
      where: { user: { id: userId } } 
    });
    
    if (!employee) return;
  
    const today = new Date().toISOString().split('T')[0];
  
    // 2. Find today's check-in record
    const record = await this.atRepo.findOne({
      where: { 
        at_date: today, 
        employee: { emp_id: employee.emp_id } 
      }
    });
  
    // 3. Update out-time if the record exists and doesn't have one yet
    if (record && !record.at_out_time) {
      record.at_out_time = new Date().toLocaleTimeString('en-GB');
      await this.atRepo.save(record);
      return { message: 'Auto check-out successful' };
    }
  }
  async checkIn(userId: string) {
    const employee = await this.empRepo.findOne({ where: { user: { id: userId } } });
    if (!employee) throw new NotFoundException('Employee not found');

    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const existingRecord = await this.atRepo.findOne({ where: { at_date: today, employee: { emp_id: employee.emp_id } } });
    if (existingRecord) throw new ConflictException('Already checked in for today');

    try {
      const newRecord = this.atRepo.create({
        at_date: today,
        at_in_time: new Date().toLocaleTimeString('en-GB'),
        employee: employee,
      });
      return this.atRepo.save(newRecord);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error checking in', error);
    }
  }

  async checkOut(userId: string): Promise<Attendance> {
    const employee = await this.empRepo.findOne({ where: { user: { id: userId } } });
    if (!employee) throw new NotFoundException('Employee not found');

    const today = new Date().toISOString().split('T')[0];

    const record = await this.atRepo.findOne({ where: { at_date: today, employee: { emp_id: employee.emp_id } } });
    if (!record) throw new NotFoundException('No check-in record found for today');
    if (record.at_out_time) throw new ConflictException('Already checked out for today');

    try {
      record.at_out_time = new Date().toLocaleTimeString('en-GB');
      return this.atRepo.save(record);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error checking out', error);
    }
  }

  async getMyAttendance(userId: string) {
    // First find the employee linked to this user
    const employee = await this.empRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!employee) {
      return []; // Return empty array if no employee found
    }

    // Then fetch attendance records for this employee
    const records = await this.atRepo.find({
      where: { employee: { emp_id: employee.emp_id } },
      order: { at_date: 'DESC' },
    });
    
    return records.map((log) => ({
      at_id: log.at_id,
      at_date: log.at_date,
      at_in_time: log.at_in_time ?? null,
      at_out_time: log.at_out_time ?? null,
      at_status: log.at_status ?? 'Present',
      overtime_minutes: log.overtime_minutes ?? 0,
    }));
  }

  async getAllAttendance() {
    const records = await this.atRepo.find({
      relations: ['employee'],
      order: { created_at: 'DESC' },
    });
    if (!records || records.length === 0) {
      throw new NotFoundException('No attendance records found');
    }
    return records;
  }
  
  async findAll() {
    const records = await this.atRepo.find({
      relations: ['employee'],
      order: { at_date: 'DESC' },
    });
    return records.map((log) => ({
      at_id: log.at_id,
      at_date: log.at_date,
      emp_name: `${log.employee.emp_first_name} ${log.employee.emp_last_name}`,
      at_in_time: log.at_in_time,
      at_out_time: log.at_out_time || 'Working...',
      at_status: log.at_status,
      device_type: log.device_type,
      location: log.location,
      overtime_minutes: log.overtime_minutes,
    }));
  }

  async getAttendanceByEmployee(empId: string) {
    const records = await this.atRepo.find({
      where: { employee: { emp_id: empId } },
      relations: ['employee'],
      order: { at_date: 'DESC' },
    });
    return records.map((log) => ({
      at_id: log.at_id,
      at_date: log.at_date,
      emp_name: log.employee
        ? `${log.employee.emp_first_name ?? ''} ${log.employee.emp_last_name ?? ''}`.trim() || log.employee.emp_email
        : '—',
      at_in_time: log.at_in_time,
      at_out_time: log.at_out_time,
      at_status: log.at_status,
      device_type: log.device_type,
      location: log.location,
      overtime_minutes: log.overtime_minutes,
    }));
  }
}