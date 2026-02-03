import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  dept_name?: string;
  description?: string;
  average_salary?: number;
  currency?: string;
  pay_frequency?: string;
  manager_id?: string;
}



