// src/attendance/entities/attendance.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Employee } from '../../employee/employee.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  at_id: string;

  @Column({ type: 'date' })
  at_date: string; // Stored as YYYY-MM-DD

  @Column({ type: 'time', nullable: true })
  at_in_time: string;

  @Column({ type: 'time', nullable: true })
  at_out_time: string;

  @Column({ default: 'present' }) // e.g., present, late, absent
  at_status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  device_type: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'int', default: 0 })
  overtime_minutes: number;

  @ManyToOne(() => Employee, (emp) => emp.attendance, { onDelete: 'CASCADE' })
  employee: Employee;

  @CreateDateColumn()
  created_at: Date;
}

 