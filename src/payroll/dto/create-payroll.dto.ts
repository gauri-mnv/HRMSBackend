import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePayrollDto {
  @IsUUID()
  emp_id: string;

  @IsNumber()
  base_salary: number;

  @IsOptional()
  @IsString()
  pay_frequency?: string; // monthly, weekly, biweekly

  @IsOptional()
  @IsString()
  currency?: string;

  @IsDateString()
  effective_from: string;

  @IsOptional()
  @IsDateString()
  effective_to?: string;
}
