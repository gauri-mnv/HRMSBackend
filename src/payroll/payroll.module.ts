import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { Employee } from '../employee/employee.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { RevokedToken } from '../auth/revoked-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, Employee, User, RevokedToken]),
    AuthModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
