import { IsEmail, MinLength } from 'class-validator';
import { IsEmailDomain } from '../../common/validators/email-domain.validator';

export class SigninDto {
  @IsEmail()
  @IsEmailDomain()
  email: string;

  @MinLength(6)
  password:string;
}

