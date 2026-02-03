import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Employee } from '../../employee/employee.entity';
import { LeaveType } from './leave-type.entity';

@Entity('leave_applications')
export class LeaveApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ default: 'Pending' }) // Pending, Approved, Rejected
  status: string;

  @Column({ type: 'uuid', nullable: true })
  approved_by: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  approved_at: Date | null;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  total_days: number;

  @ManyToOne(() => Employee, (emp) => emp.leaves)
  employee: Employee;

  @ManyToOne(() => LeaveType)
  leave_type: LeaveType;

  @CreateDateColumn()
  applied_at: Date;
}