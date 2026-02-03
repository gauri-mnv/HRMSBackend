import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { DeepPartial } from 'typeorm';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  dept_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  average_salary?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  pay_frequency?: string;

  @IsOptional()
  @IsUUID()
  manager_id?: string;
  created_at?: DeepPartial<Date>;
}