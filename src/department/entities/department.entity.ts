import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
    OneToOne, 
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
  } from 'typeorm';
  import { Employee } from '../../employee/employee.entity'; 
  
  @Entity('departments')
  export class Department {
    @PrimaryGeneratedColumn('uuid')
    dept_id: string;
  
    @Column({ unique: true })
    dept_name: string;
  
    @Column({ nullable: true })
    description: string;
  
    // Relation: One Department has many Employees
    @OneToMany(() => Employee, (employee) => employee.department)
    employees: Employee[];
  
    // Relation: One Department has one Manager (Head)
    // We assume the manager is also an Employee
    @OneToOne(() => Employee)
    @JoinColumn({ name: 'manager_id' })
    manager: Employee;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
  }