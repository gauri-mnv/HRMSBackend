import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Employee } from '../employee/employee.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
    @InjectRepository(Employee)
    private readonly empRepo: Repository<Employee>,
    @Inject(forwardRef(() => AuthService)) 
    private readonly authService: AuthService,
      ) {}

  async create(dto: CreateDepartmentDto) {
    const dept = this.deptRepo.create({
      dept_name: dto.dept_name,
      description: dto.description,
      average_salary: dto.average_salary ?? null,
      currency: dto.currency ?? 'INR',
      pay_frequency: dto.pay_frequency ?? 'monthly',
    });
    if (dto.manager_id) {
      const manager = await this.empRepo.findOneBy({ emp_id: dto.manager_id });
      if (manager) dept.manager = manager;
    }
    return this.deptRepo.save(dept);
  }

  // 2. List all Departments (with Manager info)
  async findAll() {
    // return this.deptRepo.find({
    //   relations: ['manager'], // Show who the manager is
    // });

      const departments = await this.deptRepo.find({
        relations: ['manager', 'employees'], // Load employees to show 'Total Staff'
      });
    
      // Transform the data into a cleaner format for the frontend (include employees list)
      return departments.map((dept) => ({
        dept_id: dept.dept_id,
        dept_name: dept.dept_name,
        description: dept.description,
        average_salary: dept.average_salary != null ? Number(dept.average_salary) : null,
        currency: dept.currency ?? 'INR',
        pay_frequency: dept.pay_frequency ?? 'monthly',
        manager_name: dept.manager
          ? `${dept.manager.emp_first_name} ${dept.manager.emp_last_name}`
          : 'Not Assigned',
        manager_id: dept.manager?.emp_id || null,
        total_employees: dept.employees?.length || 0,
        employees: (dept.employees ?? []).map((e) => ({
          emp_id: e.emp_id,
          emp_code: e.emp_code,
          emp_name: `${e.emp_first_name ?? ''} ${e.emp_last_name ?? ''}`.trim() || e.emp_email,
        })),
        created_at: dept.created_at,
      }));
    }
  

  // 3. Get Specific Department + Employee List
  async findOne(id: string) {
    const dept = await this.deptRepo.findOne({
      where: { dept_id: id },
      relations: ['employees', 'manager'], // <--- Fetches the working employee list
    });

    if (!dept) throw new NotFoundException(`Department with ID ${id} not found`);
    return dept;
  }

  // Get employees for a specific department (for manager dropdown)
  async getEmployeesByDepartment(deptId: string) {
    const employees = await this.empRepo.find({
      where: { department: { dept_id: deptId } },
      relations: ['department'],
      order: { emp_first_name: 'ASC' },
    });
    return employees.map((emp) => ({
      emp_id: emp.emp_id,
      emp_code: emp.emp_code,
      emp_name: `${emp.emp_first_name ?? ''} ${emp.emp_last_name ?? ''}`.trim() || emp.emp_email,
      emp_email: emp.emp_email,
    }));
  }

  // 4. Update Department
  async update(id: string, dto: UpdateDepartmentDto) {
    const dept = await this.findOne(id);
    
    if (dto.dept_name) dept.dept_name = dto.dept_name;
    if (dto.description !== undefined) dept.description = dto.description;
    if (dto.average_salary !== undefined) dept.average_salary = dto.average_salary as any;
    if (dto.currency !== undefined) dept.currency = dto.currency;
    if (dto.pay_frequency !== undefined) dept.pay_frequency = dto.pay_frequency;

    // Allow setting OR clearing manager.
    // Frontend sends "" when selecting "None".
    if (dto.manager_id !== undefined) {
      const managerId = String(dto.manager_id).trim();
      if (!managerId) {
        dept.manager = null as any;
      } else {
        const manager = await this.empRepo.findOneBy({ emp_id: managerId });
        if (!manager) {
          throw new NotFoundException('Selected manager not found');
        }
        dept.manager = manager;
      }
    }

    return this.deptRepo.save(dept);
  }

  // 5. Delete Department
  async remove(id: string) {
    const dept = await this.findOne(id);
    return this.deptRepo.softRemove(dept);
  }
}