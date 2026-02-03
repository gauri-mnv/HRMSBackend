import { CreateEmployeeDto } from './create-employee.dto';
import { IsEmail, IsOptional } from 'class-validator';
import { IsEmailDomain } from '../../common/validators/email-domain.validator';

export class UpdateEmployeeDto implements Partial<CreateEmployeeDto> {
  emp_first_name?: string;
  emp_last_name?: string;
  
  @IsOptional()
  @IsEmail()
  @IsEmailDomain()
  emp_email?: string;
  
  emp_phone?: string;
  emp_date_of_joining?: string;
  emp_status?: string;
  department_id?: number;
  dept_id?: string; // UUID of department
  Job_id?: number;
  manag_id?: number;
  emp_pay_id?: number;
  emp_dob?: string;
  emp_gender?: string;
  role_id?: number;
}


