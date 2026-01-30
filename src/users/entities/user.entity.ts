import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
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
     password:string;
    // @Column({ select: false })
    // password: string;

  
    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })//id present in role table and fk in users table
    role: Role;

    // @ManyToOne(() => Employee)
    // @JoinColumn({ name: 'employee_id' })
    // employee: Employee;

    @CreateDateColumn()
      created_at: Date;

      @UpdateDateColumn()
      updated_at: Date;

    // static password: string;

  }
  