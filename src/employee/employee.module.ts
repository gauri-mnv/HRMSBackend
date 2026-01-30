import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
// import { User } from '../users/entities/user.entity';

 import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee,User]),
  forwardRef(() => AuthModule),
  //  AuthModule,
  forwardRef(() => UsersModule)],
  controllers: [EmployeeController],
  providers: [EmployeeService],
   exports: [TypeOrmModule, EmployeeService],
})
export class EmployeeModule {}


