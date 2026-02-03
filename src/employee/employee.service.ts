import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from '../users/entities/user.entity';
import { RoleEnum } from '../common/enums/role.enum';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Department } from 'src/department/entities/department.entity';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/role.entity';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    // return this.employeeRepo.find({
    //   // // withDeleted: false,
    //   // relations: ['role', 'manager', 'user'],
    //   // // order: { emp_id: 'ASC' },
    //   // order: { created_at: 'ASC' },

      
    // });

    //console.log(this.employeeRepo);
      const emps = await this.employeeRepo.find({
        relations: ['role', 'manager', 'user', 'department'],
        order: { created_at: 'ASC' },
      });
      return emps.map((e) => ({
        emp_id: e.emp_id,
        emp_code: e.emp_code,
        emp_first_name: e.emp_first_name,
        emp_last_name: e.emp_last_name,
        emp_email: e.emp_email,
        emp_phone: e.emp_phone,
        emp_status: e.emp_status,
        emp_date_of_joining: e.emp_date_of_joining,
        emp_dob: e.emp_dob,
        emp_gender: e.emp_gender,
        role: e.role ? { id: e.role.id, name: e.role.name } : null,
        manager: e.manager
          ? { emp_id: e.manager.emp_id, name: e.manager.emp_first_name }
          : null,
        department: e.department
          ? {
              dept_id: e.department.dept_id,
              dept_name: e.department.dept_name,
              average_salary: e.department.average_salary != null ? Number(e.department.average_salary) : null,
              currency: e.department.currency ?? 'INR',
              pay_frequency: e.department.pay_frequency ?? 'monthly',
            }
          : null,
      }));
    
    
  }

  async findOne(emp_id: string) {
    const emp = await this.employeeRepo.findOne({
      where: { emp_id },
      relations: ['role', 'manager', 'department'],
    });
    if (!emp || emp.deleted_at) {
      throw new NotFoundException('Employee not found');
    }
    return {
      ...emp,
      department: emp.department
        ? {
            dept_id: emp.department.dept_id,
            dept_name: emp.department.dept_name,
            average_salary: emp.department.average_salary != null ? Number(emp.department.average_salary) : null,
            currency: emp.department.currency ?? 'INR',
            pay_frequency: emp.department.pay_frequency ?? 'monthly',
          }
        : null,
    };
  }
  async getUserByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();
  }


  async getOrCreateEmpCode(userId: string) {
    // 1Check if employee already exists for this user
    const existing = await this.employeeRepo.findOne({
      where: { user: { id: userId } },
    });
  
    if (existing) {
      return { emp_code: existing.emp_code };
    }
  
    // 2If not, generate UUID-based emp code
    const empCode = `EMP-${randomUUID().slice(0, 8).toUpperCase()}`;
  
    return { emp_code: empCode };
  }
  async findByUserId(userId: string) {
    const emp = await this.employeeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['role', 'manager', 'department'],
    });
    if (!emp || emp.deleted_at) {
      throw new NotFoundException('Employee not found for this user');
    }
    return {
      ...emp,
      department: emp.department
        ? { dept_id: emp.department.dept_id, dept_name: emp.department.dept_name }
        : null,
    };
  }

  async create(dto: CreateEmployeeDto) {
    const normalizedEmail = dto.emp_email.toLowerCase();
    
    // Check if user already exists with this email
    let user = await this.userRepo.findOne({ 
      where: { email: normalizedEmail }, 
      relations: ['role'] 
    });

    // If user doesn't exist and password is provided, create user
    if (!user && dto.password) {
      const role = await this.roleRepo.findOne({ 
        where: { name: 'EMPLOYEE' } 
      });
      if (!role) {
        throw new Error('EMPLOYEE role not found');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      
      user = this.userRepo.create({
        email: normalizedEmail,
        password: hashedPassword,
        role: role,
      });
      await this.userRepo.save(user);
    } else if (dto.userId) {
      // Use existing user if userId is provided
      user = await this.userRepo.findOne({ where: { id: dto.userId }, relations: ['role'] });
      if (!user) {
        throw new Error('User not found');
      }
    } else if (!user) {
      throw new Error('User not found and no password provided to create user');
    }

    const employee = this.employeeRepo.create({
      emp_code: dto.emp_code,
      emp_first_name: dto.emp_first_name,
      emp_last_name: dto.emp_last_name,
      emp_email: normalizedEmail,
      emp_phone: dto.emp_phone,
      emp_date_of_joining: dto.emp_date_of_joining
        ? new Date(dto.emp_date_of_joining)
        : new Date(),
      user: user,
      manager: dto.manag_id ? ({ emp_id: dto.manag_id } as any) : null,
      emp_status: dto.emp_status?.toLowerCase() as any,
      role: user.role,
      department: dto.dept_id ? ({ dept_id: dto.dept_id } as any) : undefined,
    });
    if (dto.emp_dob) (employee as any).emp_dob = new Date(dto.emp_dob);
    if (dto.emp_gender) (employee as any).emp_gender = dto.emp_gender;
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

  

  async update(emp_id: string, dto: UpdateEmployeeDto) {
    const employee = await this.employeeRepo.findOne({
      where: { emp_id },
      relations: ['role', 'manager', 'department', 'user'],
    });
    if (!employee || employee.deleted_at)
      throw new NotFoundException('Employee not found');
    if (dto.emp_first_name !== undefined) employee.emp_first_name = dto.emp_first_name;
    if (dto.emp_last_name !== undefined) employee.emp_last_name = dto.emp_last_name;
    if (dto.emp_email !== undefined) {
      employee.emp_email = dto.emp_email;
      // Sync email update to User table if employee has a linked user
      if (employee.user) {
        const normalizedEmail = dto.emp_email.toLowerCase();
        employee.user.email = normalizedEmail;
        await this.userRepo.save(employee.user);
      }
    }
    if (dto.emp_phone !== undefined) employee.emp_phone = dto.emp_phone;
    if (dto.emp_status !== undefined) employee.emp_status = dto.emp_status as any;
    if (dto.emp_date_of_joining !== undefined)
      employee.emp_date_of_joining = new Date(dto.emp_date_of_joining) as any;
    if (dto.emp_dob !== undefined) (employee as any).emp_dob = dto.emp_dob ? new Date(dto.emp_dob) : null;
    if (dto.emp_gender !== undefined) (employee as any).emp_gender = dto.emp_gender;
    if (dto.manag_id !== undefined)
      employee.manager = dto.manag_id ? ({ emp_id: dto.manag_id } as any) : null;
    if (dto.dept_id !== undefined) {
      const deptId = dto.dept_id && String(dto.dept_id).trim();
      employee.department = deptId
        ? (await this.deptRepo.findOne({ where: { dept_id: deptId } })) ?? undefined
        : (null as any);
    }
    return this.employeeRepo.save(employee);
  }

  async updateByUserId(userId: string, dto: UpdateEmployeeDto) {
    const employee = await this.employeeRepo.findOne({
      where: { user: { id: userId } },
      relations: ['role', 'manager', 'department'],
    });
    if (!employee || employee.deleted_at) {
      throw new NotFoundException('Employee not found for this user');
    }

    const allowedFields: (keyof UpdateEmployeeDto)[] = [
      'emp_first_name',
      'emp_last_name',
      'emp_phone',
      'emp_dob',
      'emp_gender',
    ];

    for (const key of allowedFields) {
      if (dto[key] !== undefined) {
        (employee as any)[key] = key === 'emp_dob' && dto[key] ? new Date(dto[key] as string) : dto[key];
      }
    }

    return this.employeeRepo.save(employee);
  }

  async softDelete(emp_id: string) {
    const employee = await this.employeeRepo.findOne({
      where: { emp_id },
      relations: ['role', 'manager', 'department'],
    });
    if (!employee || employee.deleted_at) {
      throw new NotFoundException('Employee not found');
    }
    await this.employeeRepo.softRemove(employee);
    return { message: 'Employee deleted successfully' };
  }
}

    