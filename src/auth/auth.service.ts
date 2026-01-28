import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from './revoked-token.entity';
import { createHash } from 'crypto';
import { Employee } from 'src/employee/employee.entity';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
   
    @InjectRepository(RevokedToken)
    private revokedTokenRepo: Repository<RevokedToken>,
    private jwtService: JwtService,
  ) {}

  private buildTokens(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  // Signup
  // async signup(email: string, password: string, roleName: string) {
    
  //   // 1️ Check email uniqueness
  //   const existingUser = await this.userRepo.findOne({ where: { email } });
  //   if (existingUser) throw new ConflictException(
  //     'User with this email already exists. Please login instead.',
  //   );

  //    // 2️ Validate role
  //   const role = await this.roleRepo.findOne({ where: { name: roleName } });
  //   if (!role) throw new UnauthorizedException('Invalid role');

  // // 3️ Enforce UNIQUE roles
  // const uniqueRoles = ['FOUNDER', 'CO_FOUNDER', 'ADMIN'];
  // if (uniqueRoles.includes(role.name)) {
  //   const roleExists = await this.userRepo.findOne({
  //     where: { role: { id: role.id } },
  //     relations: ['role'],
  //   });

  //   if (roleExists) {
  //     throw new ConflictException(
  //       `${role.name} already exists and cannot be created again`,
  //     );
  //   }
  // }

  //   // 4️ Hash password
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const user = this.userRepo.create({
  //      email, 
  //      password: hashedPassword, 
  //      role });
  //   await this.userRepo.save(user);

  //   // 2auto-create employee record
  //   const employee = this.employeeRepo.create({
  //     user: user,            
  //     emp_email: user.email,
  //     emp_status: 'active',    
  //   });
    
  //   await this.employeeRepo.save(employee);

  //   return { message: `${role.name} User registered successfully` };


  // }

  async signup(email: string, password: string, roleName: string) {
    return this.userRepo.manager.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, { where: { email } });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
  
      const role = await manager.findOne(Role, { where: { name: roleName } });
      if (!role) throw new UnauthorizedException('Invalid role');
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = manager.create(User, {
        email,
        password: hashedPassword,
        role,
      });
      await manager.save(user);
  
      const employee = manager.create(Employee, {
        user,
        // These fields are required (non-nullable) in `Employee` entity.
        // Populate minimal defaults so the record is actually created at signup time.
        emp_email: email,
        emp_code: `EMP-${Date.now()}`,
        emp_phone: '',
        emp_date_of_joining: new Date(),
        emp_status: 'active',
      });
      await manager.save(employee);
  
      return { message: `${role.name} User registered successfully` };
    });
  }
  

  // Signin
  async signin(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    if (!user.password) {
      throw new UnauthorizedException('User password missing');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const { accessToken, refreshToken } = this.buildTokens(payload);

    return {
      accessToken,
     refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  //logout 
  async logout(token: string) {
    console.log("t",token)
    if (!token) return;

  const hashed = createHash('sha256')
    .update(token)
    .digest('hex');

  const exists = await this.revokedTokenRepo.findOne({
    where: { token: hashed },
  });
  if (exists) {
    throw new UnauthorizedException('Token revoked');
  }
  if (!exists) {
    await this.revokedTokenRepo.save({ token: hashed });
  }

  return { message: 'Logged out successfully' };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = this.buildTokens({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Old and new password are required');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }
  
}
    