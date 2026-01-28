import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from '../users/entities/user.entity';
import { RoleEnum } from '../common/enums/role.enum';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    return this.employeeRepo.find({
      withDeleted: false,
      relations: ['role', 'manager', 'user'],
      order: { emp_id: 'ASC' },
    });
  }

  async findOne(emp_id: number) {
    const emp = await this.employeeRepo.findOne({
      where: { emp_id },
      relations: ['role', 'manager'],
    });
    if (!emp || emp.deleted_at) {
      throw new NotFoundException('Employee not found');
    }
    return emp;
  }

  async findByUserId(userId: string) {
    const emp = await this.employeeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['role', 'manager'],
    });
    if (!emp || emp.deleted_at) {
      throw new NotFoundException('Employee not found for this user');
    }
    return emp;
  }

  async create(dto: CreateEmployeeDto) {
    const employee = this.employeeRepo.create({
      emp_code: dto.emp_code,    
      emp_first_name: dto.emp_first_name,
      emp_last_name: dto.emp_last_name,
      emp_email: dto.emp_email,
      emp_phone: dto.emp_phone,
      emp_date_of_joining: dto.emp_date_of_joining
      ? new Date(dto.emp_date_of_joining)
      : new Date(), // or null if you made it nullable
      user: dto.user?? null,
      manager: dto.manag_id ? ({ id: dto.manag_id } as any) : null,
      emp_status: dto.emp_status?.toLowerCase() as any,
      // role_id: dto.role_id? ({ id: dto.role_id } as unknown as string) : null ,
      // role: dto.role_name ? ({ name: dto.role_name } as any) : null,
      // emp_dob: dto.emp_dob ? new Date(dto.emp_dob) : null,
      // emp_gender: dto.emp_gender,
      // Job_id: dto.Job_id
    });

    return this.employeeRepo.save(employee);
  }

  async createFromUserId(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');

    // Only allow creating employee records for users whose role is EMPLOYEE.
    if (user.role?.name !== RoleEnum.EMPLOYEE) {
      throw new NotFoundException('User is not an employee');
    }

    const existing = await this.employeeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'role', 'manager'],
      withDeleted: false,
    });
    if (existing && !existing.deleted_at) return existing;

    const employee = this.employeeRepo.create({
      user,
      role: user.role ?? null,
      emp_email: user.email,
      emp_code: `EMP-${Date.now()}`,
      emp_phone: '',
      emp_date_of_joining: new Date(),
      emp_status:'active',
      emp_first_name: '',
      emp_last_name: '',
      manager: null,
    });

    return this.employeeRepo.save(employee);
  }

  

  async update(emp_id: number, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(emp_id);
    Object.assign(employee, dto);
    return this.employeeRepo.save(employee);
  }

  async updateByUserId(userId: string, dto: UpdateEmployeeDto) {
    const employee = await this.findByUserId(userId);

    // Only allow self-service fields to be updated
    const allowedFields: (keyof UpdateEmployeeDto)[] = [
      'emp_first_name',
      'emp_last_name',
      'emp_phone',
      'emp_dob',
      'emp_gender',
    ];

    for (const key of allowedFields) {
      if (dto[key] !== undefined) {

        (employee as any)[key] = dto[key];
      }
    }

    return this.employeeRepo.save(employee);
  }

  async softDelete(emp_id: number) {
    const employee = await this.findOne(emp_id);
    await this.employeeRepo.softRemove(employee);
    return { message: 'Employee deleted successfully' };
  }
}

    