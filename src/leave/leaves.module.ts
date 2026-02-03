import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveApplication } from './entities/leave-application.entity';
import { LeaveTypesController } from './leave-types.controller';
import { LeaveRequestsController } from './leave-requests.controller';
import { LeaveType } from './entities/leave-type.entity';
import { Employee } from 'src/employee/employee.entity';
import { LeaveService } from './entities/leave.service';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { RevokedToken } from 'src/auth/revoked-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveType, LeaveApplication, Employee, User, RevokedToken]),
    AuthModule,
  ],
  controllers: [LeaveTypesController, LeaveRequestsController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeavesModule {}