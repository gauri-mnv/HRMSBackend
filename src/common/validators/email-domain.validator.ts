import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEmailDomain', async: false })
export class IsEmailDomainConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    // Email must end with .com or .in
    const emailLower = email.toLowerCase();
    return emailLower.endsWith('.com') || emailLower.endsWith('.in');
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email must end with .com or .in';
  }
}

export function IsEmailDomain(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailDomainConstraint,
    });
  };
}
