import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../../employee/employee.entity';

@Entity('payroll')
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  base_salary: number;

  @Column({ length: 20, default: 'monthly' }) // monthly, weekly, biweekly
  pay_frequency: string;

  @Column({ length: 3, default: 'INR' })
  currency: string;

  @Column({ type: 'date' })
  effective_from: string;

  @Column({ type: 'date', nullable: true })
  effective_to: string | null;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'emp_id' })
  employee: Employee;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
