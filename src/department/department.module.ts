import { Module , forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department } from './entities/department.entity';
import { Employee } from '../employee/employee.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // Register both entities so we can use repositories for Department AND Employee
    TypeOrmModule.forFeature([Department, Employee]), 
    forwardRef(() => AuthModule),
    UsersModule,
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService], 
})
export class DepartmentModule {}