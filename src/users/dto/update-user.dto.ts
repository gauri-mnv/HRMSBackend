import { IsEmail, IsOptional, IsUUID, MinLength } from 'class-validator';
import { IsEmailDomain } from '../../common/validators/email-domain.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsEmailDomain()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsUUID()
  role_id?: string;
}

