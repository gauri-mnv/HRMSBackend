import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from './revoked-token.entity';
import { createHash } from 'crypto';
import { Employee } from 'src/employee/employee.entity';
import { UsersService } from 'src/users/users.service';
import { AttendanceService } from 'src/attendance/attendance.service';

@Injectable()
export class AuthService {

  
  constructor(
    @Inject(forwardRef(() => UsersService))private readonly usersService: UsersService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    private readonly dataSource: DataSource,
    @InjectRepository(RevokedToken)
    private revokedTokenRepo: Repository<RevokedToken>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => AttendanceService))
    private attendanceService: AttendanceService,
  ) {}
  async validateUser(userId: string) {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });
  }
  private buildTokens(payload: {
    sub: string;
    email: string;
    role: string;
    // password?: string;
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

  
  async signup(email: string, password: string, roleName: string) {
    // return this.userRepo.manager.transaction(async (manager) => {
      return this.dataSource.transaction(async (manager) => {
        const normalizedEmail = email.toLowerCase();

      const existingUser = await manager.findOne(User, { where: { email:normalizedEmail } });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
  
      const role = await manager.findOne(Role, { where: { name: roleName } });
      if (!role) throw new UnauthorizedException('Invalid role');
  
      // const hashedPassword = await bcrypt.hash(password,10)
      
      // const hashedPassword =  await bcrypt.hash(password, 10);
      //   save(hashedPassword);
        const hashedPassword = await bcrypt.hash(password, 10);
          // User.password = hashedPassword;
        console.log(hashedPassword);
      // const hashedPassword=bcrypt.hash('Password@123', 10).then(console.log);
    
      const user = manager.create(User, {
        email:normalizedEmail,
        password: hashedPassword,
        role,
      });
      console.log(hashedPassword, user.password);
      await manager.save(user);

      console.log(user);
      const existingEmployee = await manager.findOne(Employee, {
        where: { user: { id: user.id } },
        relations: ['user'],
      });
      
      if (!existingEmployee) {
        const employee = manager.create(Employee, {
          user,
          emp_email: normalizedEmail,
          emp_code: `EMP-${Date.now()}`,
          emp_phone: '',
          emp_date_of_joining: new Date(),
          emp_status: 'active',
        });
        await manager.save(employee);
      
  
      return { message: `${role.name} User registered successfully` };
    }});
  }
  

  // Signin
  async signin(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    // const hash = await bcrypt.hash(password,10)
    // console.log(hash);

    const user = await this.userRepo
    .createQueryBuilder('user')
    .addSelect('user.password') 
    .leftJoinAndSelect('user.role', 'role')
    .where('user.email = :email', { email: normalizedEmail })
    .getOne();
   // console.log('Signin attempt for email:', email.toLowerCase());
    // const user = await this.userRepo.findOne({
    //   where: { email }
    //   // relations: ['role'],
    // });

    console.log('User fetched from DB:', user); 
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    if (!user.password) {
      console.log(user);
      throw new UnauthorizedException('User password missing');
    }

   
     const isPasswordValid = bcrypt.compareSync(password,user.password );
     console.log(password, user.password);
    console.log('Is password valid?', isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    // AUTOMATIC CHECK-IN TRIGGER
  // We call the attendance service right here during the sign-in process
  try {
    await this.attendanceService.autoCheckIn(user.id);
  } catch (err) {
    console.log("User already checked in for today, skipping auto-check-in.");
  }
    //console.log(payload)
    const { accessToken, refreshToken } = this.buildTokens(payload);
    console.log( accessToken, refreshToken , user, {
      id: user.id,
      email: user.email,
      role: user.role,
    })
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
    // Automatically trigger the attendance checkout
 
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
  await this.attendanceService.autoCheckOut(token);
  if (!exists) {
    await this.revokedTokenRepo.save({ token: hashed });
  }

  return { message: 'Logged out successfully ,attendance record ' };
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
    const user = await this.userRepo
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.id = :id', { id: userId })
    .getOne();
    // const user = await this.userRepo.findOne({
    //   where: { id: userId },
    //   relations: ['role'],
    // });
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

function save(hashedPassword: string) {
  throw new Error('Function not implemented.');
}
    