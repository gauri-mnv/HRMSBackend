import { IsEmail, IsNotEmpty, IsUUID, MinLength } from 'class-validator';
import { IsEmailDomain } from '../../common/validators/email-domain.validator';

export class CreateUserDto {
  @IsEmail()
  @IsEmailDomain()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsUUID()
  role_id: string;
}
