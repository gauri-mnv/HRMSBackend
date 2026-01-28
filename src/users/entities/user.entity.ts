import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Role } from '../../roles/role.entity';
  // import { Employee } from '../../employees/entities/employee.entity';

  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    // @ManyToOne(() => Employee)
    // @JoinColumn({ name: 'employee_id' })
    // employee: Employee;
  }
  