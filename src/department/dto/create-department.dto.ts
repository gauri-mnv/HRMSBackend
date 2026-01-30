import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  dept_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  manager_id?: string; // We will pass the UUID of the employee who is the manager
}