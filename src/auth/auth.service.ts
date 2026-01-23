import { Injectable, UnauthorizedException,ConflictException,
  BadRequestException, } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from './entities/revoked-token.entity';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private jwtService: JwtService,
    @InjectRepository(RevokedToken)
    private revokedTokenRepo: Repository<RevokedToken>,
  ) {}

  // Signup
  async signup(email: string, password: string, roleName: string) {
    
    // 1️ Check email uniqueness
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) throw new ConflictException(
      'User with this email already exists. Please login instead.',
    );

     // 2️ Validate role
    const role = await this.roleRepo.findOne({ where: { name: roleName } });
    if (!role) throw new UnauthorizedException('Invalid role');

  // 3️ Enforce UNIQUE roles
  const uniqueRoles = ['FOUNDER', 'CO_FOUNDER', 'ADMIN'];
  if (uniqueRoles.includes(role.name)) {
    const roleExists = await this.userRepo.findOne({
      where: { role: { id: role.id } },
      relations: ['role'],
    });

    if (roleExists) {
      throw new ConflictException(
        `${role.name} already exists and cannot be created again`,
      );
    }
  }


    // 4️ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
       email, 
       password: hashedPassword, 
       role });
    await this.userRepo.save(user);
    return { message: `${role.name} User registered successfully` };
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
  
    const accessToken = this.jwtService.sign(payload);
  
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
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

  if (!exists) {
    await this.revokedTokenRepo.save({ token: hashed });
  }

  return { message: 'Logged out successfully' };
  }
  
}
