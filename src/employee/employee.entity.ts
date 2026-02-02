import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';

// import { Department } from '../department/department.entity';
import { Role } from '../roles/role.entity';
// import { Job } from '../jobs/job.entity';
// import { Payroll } from '../payroll/payroll.entity';
import { User } from '../users/entities/user.entity';
import { Department } from 'src/department/entities/department.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  emp_id: string| "EMPID-000";//

  @Column({ unique: true,  nullable: false })
  emp_code: string|"EMPCODE-000";//

  @Column({ length: 255 ,  nullable: true })
  emp_first_name: string ;//

  @Column({ length: 255 ,  nullable: true })
  emp_last_name: string;//

  @Column({ length: 255, unique: true })
  emp_email: string;//

  @Column({ length: 20,  nullable: true })
  emp_phone: string;//

  @Column({ type: 'date' , nullable: true })
  emp_date_of_joining: Date| 20;//


  @Column({ type: 'enum', enum: ['active', 'resigned','inactive'], default: 'active'})
  emp_status: 'active' | 'resigned'|'inactive';
  

  @Column({ type: 'date', nullable: true })
  emp_dob: Date | "add DOB";//

  @Column({ type: 'varchar', nullable: true  })
  emp_gender: string | any;//
 



  /* ===================== RELATIONS ===================== */

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;//


  // Department, Job and Payroll relations will be enabled later
  // when those modules/entities are added.
  //
  // @ManyToOne(() => Department, (dept) => dept.employees, { nullable: true })
  // @JoinColumn({ name: 'department_id' })
  // department: Department | null;

  // @ManyToOne(() => Job, { nullable: true })
  // @JoinColumn({ name: 'job_id' })
  // job: Job | null;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role |null;//

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee | null;//

  // @ManyToOne(() => Payroll, { nullable: true })
  // @JoinColumn({ name: 'emp_pay_id' })
  // payroll: Payroll | null;

  @ManyToOne(() => Department, (dept) => dept.employees)
  @JoinColumn({ name: 'dept_id' })
  department: Department;
  /* ===================== TIME ===================== */

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;//

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;//

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;//
    attendance: any;
    leaves: any;
 


}