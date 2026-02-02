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

  // 1. Create Department
  async create(dto: CreateDepartmentDto) {
    const dept = this.deptRepo.create({
      dept_name: dto.dept_name,
      description: dto.description,

      // manager_id:dto.,
    // created_at: dto.created_at,

    
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
    
      // Transform the data into a cleaner format for the frontend
      return departments.map((dept) => ({
        dept_id: dept.dept_id,
        dept_name: dept.dept_name,
        description: dept.description,
        // Flatten manager data so the frontend doesn't have to do dept.manager?.emp_first_name
        manager_name: dept.manager 
          ? `${dept.manager.emp_first_name} ${dept.manager.emp_last_name}` 
          : 'Not Assigned',
        manager_id: dept.manager?.emp_id || null,
        total_employees: dept.employees?.length || 0,
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

  // 4. Update Department
  async update(id: string, dto: UpdateDepartmentDto) {
    const dept = await this.findOne(id);
    
    // Update basic fields
    if (dto.dept_name) dept.dept_name = dto.dept_name;
    if (dto.description) dept.description = dto.description;

    // Update Manager if provided
    if (dto.manager_id) {
      const manager = await this.empRepo.findOneBy({ emp_id: dto.manager_id });
      if (manager) dept.manager = manager;
    }

    return this.deptRepo.save(dept);
  }

  // 5. Delete Department
  async remove(id: string) {
    const dept = await this.findOne(id);
    return this.deptRepo.softRemove(dept);
  }
}