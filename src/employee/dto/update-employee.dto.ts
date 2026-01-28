import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto implements Partial<CreateEmployeeDto> {
  emp_first_name?: string;
  emp_last_name?: string;
  emp_email?: string;
  emp_phone?: string;
  emp_date_of_joining?: string;
  emp_status?: string;
  department_id?: number;
  Job_id?: number;
  manag_id?: number;
  emp_pay_id?: number;
  emp_dob?: string;
  emp_gender?: string;
  role_id?: number;
}


