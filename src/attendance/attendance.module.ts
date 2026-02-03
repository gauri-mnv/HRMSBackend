import { AuthModule } from 'src/auth/auth.module';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { Employee } from 'src/employee/employee.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { RevokedToken } from 'src/auth/revoked-token.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Attendance, Employee, User, RevokedToken]),
      UsersModule,
      forwardRef(() => AuthModule),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService],
  })
  export class AttendanceModule {}