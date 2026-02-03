import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEmailDomain } from '../../common/validators/email-domain.validator';

export class SignupDto {
  @IsEmail()
  @IsEmailDomain()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  roleName: string;
}

