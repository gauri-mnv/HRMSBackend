import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Employee } from '../employee/employee.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,
    @InjectRepository(Employee)
    private readonly empRepo: Repository<Employee>,
  ) {}

  async findAll() {
    const list = await this.payrollRepo.find({
      relations: ['employee', 'employee.department'],
      order: { effective_from: 'DESC' },
    });
    return list.map((p) => ({
      id: p.id,
      emp_id: p.employee?.emp_id,
      emp_name: p.employee
        ? `${p.employee.emp_first_name} ${p.employee.emp_last_name}`.trim()
        : '—',
      base_salary: Number(p.base_salary),
      pay_frequency: p.pay_frequency,
      currency: p.currency,
      effective_from: p.effective_from,
      effective_to: p.effective_to,
      dept_name: p.employee?.department?.dept_name ?? null,
      department_average_salary: p.employee?.department?.average_salary != null ? Number(p.employee.department.average_salary) : null,
      department_currency: p.employee?.department?.currency ?? null,
      department_pay_frequency: p.employee?.department?.pay_frequency ?? null,
    }));
  }

  async findOne(id: string) {
    const payroll = await this.payrollRepo.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!payroll) throw new NotFoundException(`Payroll with ID ${id} not found`);
    return {
      id: payroll.id,
      emp_id: payroll.employee?.emp_id,
      emp_name: payroll.employee
        ? `${payroll.employee.emp_first_name} ${payroll.employee.emp_last_name}`.trim()
        : '—',
      base_salary: Number(payroll.base_salary),
      pay_frequency: payroll.pay_frequency,
      currency: payroll.currency,
      effective_from: payroll.effective_from,
      effective_to: payroll.effective_to,
    };
  }

  async create(dto: CreatePayrollDto) {
    const employee = await this.empRepo.findOne({
      where: { emp_id: dto.emp_id },
      relations: ['department'],
    });
    if (!employee) throw new NotFoundException(`Employee ${dto.emp_id} not found`);

    let baseSalary = dto.base_salary;
    let payFrequency = dto.pay_frequency ?? 'monthly';
    let currency = dto.currency ?? 'INR';
    if ((baseSalary == null || baseSalary === 0) && employee.department?.average_salary != null) {
      baseSalary = Number(employee.department.average_salary);
      payFrequency = employee.department.pay_frequency ?? 'monthly';
      currency = employee.department.currency ?? 'INR';
    }

    const payroll = this.payrollRepo.create({
      base_salary: baseSalary,
      pay_frequency: payFrequency,
      currency,
      effective_from: dto.effective_from,
      effective_to: dto.effective_to ?? null,
      employee,
    });
    return this.payrollRepo.save(payroll);
  }

  async update(id: string, dto: UpdatePayrollDto) {
    const payroll = await this.payrollRepo.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!payroll) throw new NotFoundException(`Payroll with ID ${id} not found`);

    if (dto.base_salary !== undefined) payroll.base_salary = dto.base_salary as any;
    if (dto.pay_frequency !== undefined) payroll.pay_frequency = dto.pay_frequency;
    if (dto.currency !== undefined) payroll.currency = dto.currency;
    if (dto.effective_from !== undefined) payroll.effective_from = dto.effective_from;
    if (dto.effective_to !== undefined) payroll.effective_to = dto.effective_to ?? null;
    if (dto.emp_id !== undefined) {
      const employee = await this.empRepo.findOne({ where: { emp_id: dto.emp_id } });
      if (employee) payroll.employee = employee;
    }
    return this.payrollRepo.save(payroll);
  }

  async remove(id: string) {
    const payroll = await this.payrollRepo.findOne({ where: { id } });
    if (!payroll) throw new NotFoundException(`Payroll with ID ${id} not found`);
    await this.payrollRepo.remove(payroll);
    return { message: 'Payroll record deleted' };
  }

  async getByUserId(userId: string) {
    const employee = await this.empRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });
    if (!employee) return { payroll: [], department_average: null, department_name: null };
    const list = await this.payrollRepo.find({
      where: { employee: { emp_id: employee.emp_id } },
      relations: ['employee'],
      order: { effective_from: 'DESC' },
    });
    const payroll = list.map((p) => ({
      id: p.id,
      base_salary: Number(p.base_salary),
      pay_frequency: p.pay_frequency,
      currency: p.currency,
      effective_from: p.effective_from,
      effective_to: p.effective_to,
    }));
    const department_average = employee.department?.average_salary != null ? Number(employee.department.average_salary) : null;
    const department_name = employee.department?.dept_name ?? null;
    const department_currency = employee.department?.currency ?? 'INR';
    const department_pay_frequency = employee.department?.pay_frequency ?? 'monthly';
    return {
      payroll,
      department_average,
      department_name,
      department_currency,
      department_pay_frequency,
    };
  }

  /** Create approx payroll for employees who have none (for demo/seed). */
  async seedApproxPayments(): Promise<{ created: number; skipped: number; message: string }> {
    const employees = await this.empRepo.find({
      relations: ['department'],
    });
    const today = new Date().toISOString().split('T')[0];
    let created = 0;
    let skipped = 0;
    for (const emp of employees) {
      const existing = await this.payrollRepo.findOne({
        where: { employee: { emp_id: emp.emp_id } },
      });
      if (existing) {
        skipped++;
        continue;
      }
      const baseSalary =
        emp.department?.average_salary != null
          ? Number(emp.department.average_salary)
          : 50000;
      const currency = emp.department?.currency ?? 'INR';
      const payFrequency = emp.department?.pay_frequency ?? 'monthly';
      const payroll = this.payrollRepo.create({
        base_salary: baseSalary,
        currency,
        pay_frequency: payFrequency,
        effective_from: today,
        effective_to: null,
        employee: emp,
      });
      await this.payrollRepo.save(payroll);
      created++;
    }
    return {
      created,
      skipped,
      message: `Created ${created} approx payroll record(s), skipped ${skipped} (already have payroll).`,
    };
  }
}
