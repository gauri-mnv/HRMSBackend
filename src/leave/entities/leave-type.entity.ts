import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('leave_types')
export class LeaveType {
  @PrimaryGeneratedColumn('uuid')
  leave_type_id: string;

  @Column({ unique: true })
  leave_type_name: string; // e.g., "Sick Leave", "Vacation"

  @Column({ type: 'int', default: 0 })
  total_days: number; // Max days allowed per year

  @Column({ default: 'Active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}