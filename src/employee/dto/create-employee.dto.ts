import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/roles/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Column } from 'typeorm';
import { IsEmailDomain } from '../../common/validators/email-domain.validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  emp_code: string;

  emp_role_id: string;
  
  @IsString()
  @MaxLength(255)
  emp_first_name: string;

  @IsString()
  @MaxLength(255)
  emp_last_name: string;

  @IsEmail()
  @IsEmailDomain()
  emp_email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  @MaxLength(20)
  emp_phone: string;

  @IsDateString()
  emp_date_of_joining: string;

  @IsOptional()
  @Column({ default: 'ACTIVE' })
  emp_status: string;

  @IsOptional()
  @IsInt()
  department_id?: number;

  @IsOptional()
  @IsString()
  dept_id?: string; // UUID of department

  @IsOptional()
  @IsInt()
  Job_id?: number;

  @IsOptional()
  @IsInt()
  manag_id?: number;

  @IsOptional()
  @IsInt()
  emp_pay_id?: number;

  @IsOptional()
  @IsDateString()
  emp_dob?: string;

  @IsOptional()
  @IsString()
  emp_gender?: any;

  @IsOptional()
  @IsInt()
  role_id?:any;
  user:User;
  role_name: string|Role;
  userId: any;

}

